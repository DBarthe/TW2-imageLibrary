/*
 * This file contains the controllers of the client.
 */

var photoLib = (function(photoLib){

  console.log("loading controllers")

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  /**
   * The prototype of all controllers
   */
  var ctrlPrototype = Object.create(Object.prototype, {
    // a function that initializes the controller.
    'initialize': {
      writable: true,
      value: function(){
        throw 'controller.initialize is not implemented'
      }
    },

    // a function that attachs the contoller to some events
    'bind': {
      writable: true,
      value: function(){
        throw 'controller.bind is not implemented'
      }
    }
  })


  /**
   * The controller of the image search. It's in charge of the searchResults model.
   */
  var searchResultsCtrl = Object.create(ctrlPrototype);

  searchResultsCtrl.initialize = function(){

    this.submitButton = document.getElementById('sidebar-search-submit')

    this.textInput = document.getElementById('sidebar-text-input');
    this.authorInput = document.getElementById('sidebar-author-input');
    this.categoryInput = document.getElementById('sidebar-category-input');
    this.userInput = document.getElementById('sidebar-user-input');
    this.tagsInput = document.getElementById('sidebar-tags-input');
  }

  searchResultsCtrl.bind = function(){
    var that = this

    this.submitButton.addEventListener('click', function(e){
      if (e.defaultPrevented){
        e.preventDefault()
      }
      console.log('toto')
      that.processSubmit()
    }, false)
  }

  /**
   * Called when the search button is clicked
   */
  searchResultsCtrl.processSubmit = function(){

    // TODO
    console.log('processSubmit')
    console.log(this.textInput.value)
    console.log(this.authorInput.value)
    console.log(this.categoryInput.value)
    console.log(this.userInput.value)
    console.log(this.tagsInput.value)

    this.fetchImages({'withId': true}, true)
  }

  /**
   * Fetch the images from the server (via the web-service), according to
   * the given criteria.
   * if the erase parameter is set to true, the current search result is replaced
   * by the new, otherwise, the result is extended.
   */
  searchResultsCtrl.fetchImages = function(criteria, erase){

    var that = this
        baseUrl = './image-search.php'
      , request = new photoLib.services.AsyncGetRequest(baseUrl, criteria)

    request.onLoad = function(e){
      function failureHelper(){ photoLib.models.searchStatus.setSuccess() }

      if (this.status != 200){
        return failureHelper();
      }

      var responseObj = JSON.parse(this.responseText)
      if (responseObj.status == 'ok'){
        that.populateModels(responseObj, erase)
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
      console.log('progress: '+progress)
      photoLib.models.searchStatus.setLoading(progress)
    }

    request.onFailure = function(){
      console.log('failure')
      photoLib.models.searchStatus.setFailure()
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
    //TODO: thumbnailDir
    console.log('load')
    var collection = []

    for (var i = 0; i < responseObj.result.length; i += 1){
      var entry = responseObj.result[i]
        , params = this.mapEntryToBuilderParams(entry)
        , img = photoLib.models.buildImage(params)
      collection.push(img)
    }

    if (erase){
      photoLib.models.searchResults.replace(collection)
    }
    else {
      photoLib.models.searchResults.feed(collection)
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
    entry.categoryList = entry.categories.split(' ');
    entry.tagList = entry.keywords.split(' ');
    return entry
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
    manager.initializeThem()
    manager.bindThem()
  }

  window.addEventListener('load', initialize, false)

  return photoLib

})(photoLib);