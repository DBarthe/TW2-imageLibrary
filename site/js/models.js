/*
 * This file contains the model part in the client-side. 
 */

// within namespace 'photoLib'
var photoLib = (function(photoLib){

  console.log("loading models")

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  /**
   * this is the prototype that implements the observer design pattern
   */
  var modelPrototype = Object.create(Object.prototype, {
 
    'nextObserverId': { writable: true, enumerable: true },

    'observerMap': { writable: true, enumerable: true },

    'initialize': {
      value: function(){
        this.nextObserverId = 0
        this.observerMap = {}
      }
    },

    /**
     * attach an observer to the model
     * @param function observer is a callback that will be called when the model changes.
     *                          This callback may take one argument: an object that contains
     *                          the 'observerId' and the 'model' itself.
     * @return int the observer id, useful to detach the observer further     
     */
    'attach': {
      value: function(observer){
        var id = this.nextObserverId
        this.nextObserverId += 1
        this.observerMap[id] = observer
        return id
      }
    },

    /**
     * detach an observer.
     * @param int observerId the id returned by attach().
     * @return bool true if the observer has been removed, false if it does't exist.
     */
    'detach': {
      value: function(observerId){
        if (!this.observerMap.hasOwnProperty(observerId)){
          return false
        }
        delete this.observerMap[observerId]
        return true
      }
    },

    /**
     * Notify all the observers that the model has changed.
     */
    'notify': {
      value: function(){
        for (var id in this.observerMap){
          if (this.observerMap.hasOwnProperty(id)){
            this.observerMap[id]({ observerId: id, model: this })
          }
        }
      }
    }
  })

  var imageSetterHelper = function(img, property, value, typesExpected){

    typesExpected = [].concat(typesExpected)

    for (var i = 0; i < typesExpected.length; i += 1){
      if (typeof value === typesExpected[i]){
        img['_' + property] = value
        return;
      }
    }

    console.log('error: invalid image ' + property + '(' + typeof value + ')')
  }

  /**
   * This is an image prototype. Others models like searchResults
   * that maintain a collection of image will depends on it.
   */
  var imagePrototype = Object.create(Object.prototype, {
    'id': {
      get: function(){ return this._id },
      set: function(id){ imageSetterHelper(this, 'id', id, ['number', 'string']) }
    },

    'url': {
      get: function(){ return this._url },
      set: function(url){ imageSetterHelper(this, 'url', url, 'string') }
    },

    'size': {
      get: function(){ return this._size },
      set: function(size){
        if (typeof size !== 'object' ||
            !size.hasOwnProperty('width') || !size.hasOwnProperty('height') ||
            typeof size.width !== 'number' || typeof size.height !== 'number'){
          throw 'error: invalid image size'
        }
        this._size = size;
      }
    },

    'thumbnail': {
      get: function(){ return this._thumbnail },
      set: function(thumbnail){ imageSetterHelper(this, 'thumbnail', thumbnail, 'string') }
    },

    'author': {
      get: function(){ return this._author },
      set: function(author){ imageSetterHelper(this, 'author', author, 'string') }
    },

    'authorUrl': {
      get: function(){ return this._authorUrl },
      set: function(authorUrl){ imageSetterHelper(this, 'authorUrl', authorUrl, ['string', 'undefined']) }
    },

    'title': {
      get: function(){ return this._title },
      set: function(title){ imageSetterHelper(this, 'title', title, 'string') }
    },

    'categoryList': {
      get: function(){ return this._categoryList },
      set: function(categoryList){
        if (typeof categoryList === 'undefined' || categoryList.constructor !== Array){
          throw 'error: invalid image categoryList';
        }
        this._categoryList = categoryList
      }
    },

    'tagList': {
      get: function(){ return this._tagList },
      set: function(tagList){
        if (typeof tagList === 'undefined' || tagList.constructor !== Array){
          throw 'error: invalid image tagList';
        }
        this._tagList = tagList
      }
    }
  })

  var imageProperties = [
    'id', 'url', 'size', 'thumbnail', 'author',
    'authorUrl', 'title', 'categoryList', 'tagList'
  ]

  /**
   * Build an image, checking the validity of the given values.
   * @param  object values   the values of the wanted images, will be validate, all field are required
   * @return image  an image object
   * @throws an exception if 'values' is not valid.
   */
  var buildImage = function(values){
    var img = Object.create(imagePrototype);
    
    for (var i = 0; i < imageProperties.length; i += 1){
      var property = imageProperties[i];
      console.log(property + '=' + values[property] + " - " + (typeof values[property]));

      if (values[property] === null){
        img[property] = undefined        
      }
      else {
        img[property] = values[property]
      }
    }

    return img
  }

  /**
   * Create a searchResults model prototype, used to store the collection of images
   * that match the filters and have to be displayed, depending of the current viewMode
   */
  var searchResults = Object.create(modelPrototype, {

    // the collection of images
    '_collection': { value: [], writable: true, enumerable: true },

    // collection hiden getter and setter
    'collection': {
      get: function(){
        return this._collection
      },

      // this setter calls this.notify to inform the obervers that the model has changed
      set: function(collection){
        console.log("collection change")
        this._collection = collection
        this.notify()
      }
    },

    /**
     * replace the current collection by a new collection of image
     * @param array collection an array of images
     */
    'replace': {
      value: function(collection){
        console.log("collection rep")
        this.collection = collection
      }
    },

    /**
     * add a collection or an item to the current collection
     * @param {array|image} collectionOrItem an array of images, or an image
     */
    'feed': {
      value: function(collectionOrItem){
        this.collection = this.collection.concat(collectionOrItem)
      }
    },

    /**
     * Empty the collection.
     */
    'clear': {
      value: function(){
        this.collection = []
      }
    }
  })

  /**
   * Information about the connexion to the server api
   */
  var searchStatus = Object.create(modelPrototype, {

    'str': { value: 'none', enumerable: true, writable: true },
    'options': { value: {}, enumerable: true, writable: true },

    'setLoading': {
      // progress is in percent
      value: function(progress){
        if (typeof progress === 'undefined'){
          progress = 0
        }
        this.str = 'loading'
        this.options = { progress: progress }
        this.notify()
      }
    },

    'setNone': {
      value: function(){
        this.str = 'none'
        this.options = {}
        this.notify()
      }
    },

    'setSuccess': {
      value: function(){
        this.str = 'success'
        this.options = {}
        this.notify()
      }
    },

    'setFailure': {
      value: function(){
        this.str = 'failure'
        this.options = {}
        this.notify()
      }
    }
  })


  searchResults.initialize()
  searchStatus.initialize()


  // Create a sub-namespace 'models'. Add some of the the previous definitions to it.
  photoLib.models = {
    buildImage: buildImage,
    searchResults: searchResults,
    searchStatus: searchStatus,
    session: null,
    userCollection: null,
    viewMode: null,
    thumbnailDir: null
  }

  return photoLib

})(photoLib)