/*
 * This file contains the controllers of the client.
 */

var photoLib = (function(photoLib){

  console.log("loading controllers")

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  const FETCH_CHUNK_SIZE = 10

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

    this.moreButton.addEventListener('click', function(){
      that.askMoreResults()
    }, false)


    window.addEventListener('keypress', function(e){
      if (e.keyCode == 13 && photoLib.models.viewMode.mode === 'list'){
        that.processSubmit()
        return false
      }
      else {
        return true
      }
    }, false)

    var mouseScrollCallback = function(e){
      if (e.deltaY > 0){
        if (window.scrollY >= photoLib.utils.getScrollMaxY()){
          that.askMoreResults()
        }
      }
    }

    var pageScrollCallback = function(e){
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight){
        that.askMoreResults()
      }      
    }

    if (typeof window.onwheel !== 'undefined'){
      window.addEventListener('wheel', mouseScrollCallback, false)
    }
    else if (typeof window.onmousewheel !== 'undefined'){
      window.addEventListener('mousewheel', mouseScrollCallback, false)
    }
    else {
      // support only when page is longer than the screen
      window.addEventListener("scroll", pageScrollCallback, false) 
    }

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
      , baseUrl = './image-search.php'
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
    this.tagInput = document.getElementById('slide-tag-input')
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

    this.tagInput.addEventListener('keypress', function(e){
      if (e.keyCode == 13){
        that.addTag()
        return true
      }
      else {
        return false
      }
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

  slideShowCtrl.removeTag = function(tag){
    var that = this
      , baseUrl = './tags.php'
      , params = {
        action: 'remove',
        id: photoLib.models.viewMode.options.image.id,
        tag: tag
      }
      , request = new photoLib.services.AsyncGetRequest(baseUrl, params)

    request.onLoad = function(e){
      if (this.status != 200){
        console.log('server error')
      }
    }
    request.onFailure = function(){
      console.log('failure')
    }

    var index = photoLib.models.viewMode.options.image.tagList.indexOf(tag)
    photoLib.models.viewMode.options.image.tagList.splice(index, 1)
    photoLib.models.viewMode.notify()

    request.send()
  }

  slideShowCtrl.addTag = function(){
    var tag = this.tagInput.value
    this.tagInput.value = ''
    if (tag !== ''){
      var that = this
        , baseUrl = './tags.php'
        , params = {
          action: 'add',
          id: photoLib.models.viewMode.options.image.id,
          tag: tag
        }
        , request = new photoLib.services.AsyncGetRequest(baseUrl, params)

      request.onLoad = function(e){
        if (this.status != 200){
          console.log('server error')
        }
      }
      request.onFailure = function(){
        console.log('failure')
      }

      var tags = tag.split(' ')
      for (var i = 0; i < tags.length; i += 1){
        var t = tags[i]
        if (t !== '' && photoLib.models.viewMode.options.image.tagList.indexOf(t) === -1){
          photoLib.models.viewMode.options.image.tagList.push(t)
        }
      }
      photoLib.models.viewMode.notify()

      request.send()
    }
  }

  /**
   * Session controller
   */
  var sessionCtrl = Object.create(ctrlPrototype)

  sessionCtrl.initialize = function(){
    this.updateDelay = 10000 // 10s
    this.firstTime = true
  }

  sessionCtrl.bind = function(){
    var that = this
    if (this.firstTime){
      this.firstTime = false
      that.update() // this will call bind again
    }
    else {
      setTimeout(function(){ that.update() }, this.updateDelay)
    }
  }

  sessionCtrl.update = function(){
    var that = this
      , baseUrl = './who-am-i.php'
      , request = new photoLib.services.AsyncGetRequest(baseUrl)

    request.onLoad = function(e){
      if (this.status != 200){
        console.log('server error')
        photoLib.models.session.tagAsAnonymous()
      }
      else {
        var responseObj = JSON.parse(this.responseText)
        if (responseObj.authenticated === false){
          photoLib.models.session.tagAsAnonymous()
        }
        else {
          photoLib.models.session.tagAsLogged(responseObj.username)
        }
      }
    }

    request.onFailure = function(){
      console.log('failure')
      photoLib.models.session.tagAsAnonymous()
    }

    request.onEnd = function(){
      that.bind() // rebind to the near 5 sec
    }

    request.send()
  }


  /**
   * a controller to manage user favorites collection
   */
  var favoritesCtrl = Object.create(ctrlPrototype)

  favoritesCtrl.bind = function(){
    var that = this

    photoLib.models.session.attach(function(){
      console.log('sessionHasChanged')
      that.sessionHasChanged()
    })
  }

  favoritesCtrl.sessionHasChanged = function(){
    if (photoLib.models.session.isLogged()){
      this.fetchUserFavorites()
    }
    else {
      photoLib.models.favorites.clear()  
    }
  }

  favoritesCtrl.fetchUserFavorites = function(){
    var that = this
      , criteria = {
          collection: photoLib.models.session.username,
          withId: true
        }
      , baseUrl = './image-search.php'
      , request = new photoLib.services.AsyncGetRequest(baseUrl, criteria)

    request.onLoad = function(e){

      if (this.status != 200){
        photoLib.models.favorites.clear()
      }

      var responseObj = JSON.parse(this.responseText)
      if (responseObj.status != 'ok'){
        photoLib.models.favorites.clear()
      }

      that.populateFavorites(responseObj)
    }

    request.onFailure = function(){
      console.log('failure')
      photoLib.models.favorites.clear()
    }

    request.send();
  }

  favoritesCtrl.mapEntryToBuilderParams = searchResultsCtrl.mapEntryToBuilderParams

  favoritesCtrl.populateFavorites = function(responseObj){
    var collection = []

    for (var i = 0; i < responseObj.result.length; i += 1){
      var entry = responseObj.result[i]
        , params = this.mapEntryToBuilderParams(entry)
        , img = photoLib.models.buildImage(params)
      collection.push(img)
    }

    photoLib.models.favorites.replace(collection)
  }

  favoritesCtrl.addToFavorites = function(imageId){
    var image = photoLib.models.searchResults.getImageById(imageId)
    photoLib.models.favorites.feed([image])
    this.toogleFavoriteOnServer('add', imageId)
  }

  favoritesCtrl.removeFromFavorites = function(imageId){
    photoLib.models.favorites.remove(imageId)
    this.toogleFavoriteOnServer('remove', imageId)
  }

  favoritesCtrl.toogleFavoriteOnServer = function(action, imageId){
    var that = this
      , params = { action: action, id: imageId }
      , baseUrl = './favorites.php'
      , request = new photoLib.services.AsyncGetRequest(baseUrl, params)

    request.onFailure = function(){
      console.log('failure')
    }

    request.send();
  }


  /*
   * A manager that maintains a table of controllers.
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
    manager.addCtrl(sessionCtrl)
    manager.addCtrl(favoritesCtrl)

    manager.initializeThem()
    manager.bindThem()
  }

  photoLib.controllers = {
    thumbButtons: thumbButtonsCtrl,
    searchResults: searchResultsCtrl,
    slideShow: slideShowCtrl,
    session: sessionCtrl,
    favorites: favoritesCtrl
  }

  window.addEventListener('load', initialize, false)

  return photoLib

})(photoLib);