/*
 * This file contains the controllers of the client.
 */

var photoLib = (function(photoLib){

  console.log("loading controllers")

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  const FETCH_CHUNK_SIZE = 2

  /**
   * The prototype of all controllers
   */
  var ctrlPrototype = Object.create(Object.prototype, {
    // a function that initializes the controller.
    'initialize': {
      writable: true,
      value: function(){}
    },

    // a function that attachs the contoller to some events
    'bind': {
      writable: true,
      value: function(){}
    }
  })

  /**
   * The controller of the image search. It's in charge of the searchResults model.
   */
  var searchResultsCtrl = Object.create(ctrlPrototype);

  searchResultsCtrl.initialize = function(){
  
    this.submitButton = document.getElementById('sidebar-search-submit')

    this.textInput = document.getElementById('sidebar-text-input')
    this.authorInput = document.getElementById('sidebar-author-input')
    this.categoryInput = document.getElementById('sidebar-category-input')
    this.userInput = document.getElementById('sidebar-user-input')
    this.tagsInput = document.getElementById('sidebar-tags-input')

    this.moreButton = document.getElementById('more-button')
  }

  searchResultsCtrl.bind = function(){
    var that = this

    this.submitButton.addEventListener('click', function(e){
      if (e.defaultPrevented){
        e.preventDefault()
      }
      that.processSubmit()
    }, false)


    window.addEventListener("scroll", function(){
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight){
        that.askMoreResults()
      }
    })
    this.moreButton.addEventListener('click', function(){
      that.askMoreResults()
    })
  }

  /**
   * Called when the search button is clicked
   */
  searchResultsCtrl.processSubmit = function(){

    var criteria = {
      withId: true,
      text: this.textInput.value,
      category: this.categoryInput.value,
      author: this.authorInput.value,
      keywords: this.tagsInput.value,
      collection: this.userInput.value,
      from: 0,
      limit: FETCH_CHUNK_SIZE
    }

    this.fetchImages(criteria, true)
    photoLib.models.searchCriteria.criteria = criteria
  }

  /**
   * called when the button 'more' is clicked, or when the page is scrolled down
   * a callback can be optionally given to be executed at the end of the process
   */
  searchResultsCtrl.askMoreResults = function(callback){
    console.log(photoLib.models.searchResults.finished)
    if (photoLib.models.searchStatus.str != 'success' 
      || photoLib.models.searchResults.finished){
      return;
    }
    var criteria = photoLib.models.searchCriteria.criteria;
    criteria.from += FETCH_CHUNK_SIZE
    this.fetchImages(criteria, false, callback)
    photoLib.models.searchCriteria.criteria = criteria
  }

  /**
   * Fetch the images from the server (via the web-service), according to
   * the given criteria.
   * if the erase parameter is set to true, the current search result is replaced
   * by the new, otherwise, the result is extended.
   * a callback can be optionally given to be executed at the end of the process
   */
  searchResultsCtrl.fetchImages = function(criteria, erase, callback){

    var that = this
        baseUrl = './image-search.php'
      , request = new photoLib.services.AsyncGetRequest(baseUrl, criteria)

    request.onLoad = function(e){
      function failureHelper(){
        photoLib.models.searchStatus.setSuccess()
        callback && callback()
      }

      if (this.status != 200){
        return failureHelper();
      }

      var responseObj = JSON.parse(this.responseText)
      if (responseObj.status == 'ok'){
        that.populateModels(responseObj, erase)
        photoLib.models.searchStatus.setSuccess()
        callback && callback()
      }
      else {
        failureHelper();
      }
    }

    request.onProgress = function(e){
      var progress = undefined
      if (e.lengthComputable){
        progress = (e.loaded / e.total) * 100
      }
      photoLib.models.searchStatus.setLoading(progress)
    }

    request.onFailure = function(){
      console.log('failure')
      photoLib.models.searchStatus.setFailure()
      callback && callback()
    }

    photoLib.models.searchStatus.setLoading()
    request.send();
  }


  /**
   * populate the models with the response of the server api
   * if the erase parameter is set to true, the current search result is replaced
   * by the new, otherwise, the result is extended.
   */
  searchResultsCtrl.populateModels = function(responseObj, erase){
    var collection = []

    for (var i = 0; i < responseObj.result.length; i += 1){
      var entry = responseObj.result[i]
        , params = this.mapEntryToBuilderParams(entry)
        , img = photoLib.models.buildImage(params)
      collection.push(img)
    }

    var finished = collection.length < FETCH_CHUNK_SIZE

    if (erase){
      photoLib.models.searchResults.replace(collection, finished)
    }
    else {
      photoLib.models.searchResults.feed(collection, finished)
    }
  }

  /**
   * Transform an image entry received from the server, into a image builder parameter
   */
  searchResultsCtrl.mapEntryToBuilderParams = function(entry){
    entry.size = {
      width: entry.size[0],
      height: entry.size[1]
    }
    entry.authorUrl = entry.url_author
    entry.categoryList = entry.categories.split(' ')
    entry.tagList = entry.keywords.split(' ')
    entry.license = entry.licence
    return entry
  }


  /**
   * Controller for the buttons embeded in each thumbail
   * @type {[type]}
   */
  var thumbButtonsCtrl = Object.create(ctrlPrototype)

  /**
   * binded to the buttons elements directly by the view via html
   * (not good but i don't know how to do that properly)
   */
  thumbButtonsCtrl.viewImage = function(id){

    var img = photoLib.models.searchResults.getImageById(id)

    if (img === null){
      console.log('error: image not found ' + id)
      return;
    }

    photoLib.models.viewMode.toggleSlide(img)
  }

  /**
   * Slide show controller
   */
  var slideShowCtrl = Object.create(ctrlPrototype)

  slideShowCtrl.initialize = function(){
    this.exitButton = document.getElementById('slide-exit-button-out')
    this.prevButton = document.getElementById('slide-prev-button-mid')
    this.succButton = document.getElementById('slide-succ-button-mid')
  }

  slideShowCtrl.bind = function(){
    var that = this
    this.exitButton.addEventListener('click', function(){
      that.exit()
    }, false)
    this.prevButton.addEventListener('click', function(){
      that.prev()
    }, false)
    this.succButton.addEventListener('click', function(){
      that.succ()
    }, false)
  }

  slideShowCtrl.exit = function(){
    photoLib.models.viewMode.toggleList()
  }

  slideShowCtrl.prev = function(){
    if (photoLib.models.viewMode.mode == 'slide'){
      var currentImg = photoLib.models.viewMode.options.image
        , newImg = photoLib.models.searchResults.getPreviousImage(currentImg.id)
      photoLib.models.viewMode.toggleSlide(newImg)
    }
  }

  slideShowCtrl.succ = function(){
    if (photoLib.models.viewMode.mode == 'slide'){
      var currentImg = photoLib.models.viewMode.options.image

      var helper = function(){
        var newImg = photoLib.models.searchResults.getNextImage(currentImg.id)
        photoLib.models.viewMode.toggleSlide(newImg)
      }

      var length = photoLib.models.searchResults.collection.length
        , lastImg = photoLib.models.searchResults.collection[length - 1]

      // if we are at the last image, try to fetch more image 
      if (currentImg.id === lastImg.id && !photoLib.models.searchResults.finished){
        searchResultsCtrl.askMoreResults(helper)
      }
      else {
        helper()
      }
    }
  }

  /*
   * A manager to maintiain a table of controller.
   */
  var manager = Object.create(Object.prototype, {

    'ctrlTable': { value: [], writable: true, enumerable: true },

    'addCtrl': {
      value: function(ctrl){
        this.ctrlTable.push(ctrl)
      }
    },

    'initializeThem': {
      value: function(){
        this.ctrlTable.forEach(function(ctrl){
          ctrl.initialize()
        });
      }
    },

    'bindThem': {
      value: function(){
        this.ctrlTable.forEach(function(ctrl){
          ctrl.bind()
        })
      }
    }
  })

  function initialize(){

    manager.addCtrl(searchResultsCtrl)
    manager.addCtrl(thumbButtonsCtrl)
    manager.addCtrl(slideShowCtrl)


    manager.initializeThem()
    manager.bindThem()
  }

  photoLib.controllers = {
    thumbButtons: thumbButtonsCtrl,
    searchResults: searchResultsCtrl,
    slideShow: slideShowCtrl
  }

  window.addEventListener('load', initialize, false)

  return photoLib

})(photoLib);