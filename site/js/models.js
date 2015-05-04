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
      set: function(url){
        imageSetterHelper(this, 'url',
          photoLib.utils.normalizeURL(url), 'string')
      }
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
    },

    'license': {
      get: function(){ return this._license },
      set: function(license){
        if (typeof license === 'undefined' || license.constructor !== Array){
          throw 'error: invalid image license';
        }
        this._license = {
          by: license[0],
          sa: license[1],
          nc: license[2],
          nd: license[3],
        }
      }
    }
  })

  var imageProperties = [
    'id', 'url', 'size', 'thumbnail', 'author', 'authorUrl',
    'title', 'categoryList', 'tagList', 'license'
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
      var property = imageProperties[i]
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
    '_collection': { value: [], writable: true, enumerable: false },


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

    // true we can't fetch more resutls for the current search
    '_finished': { value: true, writable: true, enumerable: false },
    'finished': {
      get: function(){
        return this._finished
      },
      set: function(value){
        this._finished = value
        this.notify()
      }
    },


    /**
     * replace the current collection by a new collection of image
     * @param array collection an array of images
     */
    'replace': {
      value: function(collection, finished){
        console.log("collection rep")
        if (typeof finished !== 'undefined'){
          this._finished = finished
        }
        this.collection = collection
      }
    },

    /**
     * add a collection or an item to the current collection
     * @param {array|image} collectionOrItem an array of images, or an image
     */
    'feed': {
      value: function(collectionOrItem, finished){
        if (typeof finished !== 'undefined'){
          this._finished = finished
        }
        this.collection = this.collection.concat(collectionOrItem)
      }
    },

    /**
     * Empty the collection.
     */
    'clear': {
      value: function(finished){
        if (typeof finished !== 'undefined'){
          this._finished = finished
        }
        this.collection = []
      }
    },

    /**
     * Return the image with the given id or null
     */
    'getImageById': {
      value: function(id){
        for (var i = 0; i < this._collection.length; i += 1){
          if (this._collection[i].id === id){
            return this._collection[i]
          }
        }
        return null
      }
    },

    /**
     * Return the image that follow the image with the given id
     * or null if it doesn't exist
     */
    'getNextImage': {
      value: function(id){
        for (var i = 0; i < this._collection.length; i += 1){
          if (this._collection[i].id === id){
            return this._collection[(i + 1) % this._collection.length]
          }
        }
        return null
      }
    },

    /**
     * Return the image followed by the image with the given id
     * or null if it doesn't exist
     */
    'getPreviousImage': {
      value: function(id){
        for (var i = 0; i < this._collection.length; i += 1){
          if (this._collection[i].id === id){
            var index = (i > 0 ? i - 1: this._collection.length - 1)
            return this._collection[index]
          }
        }
        return null
      }
    },
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

  /**
   * The last criteria of the search, used to load more results.
   */
  var searchCriteria = Object.create(modelPrototype, {
    'criteria': { value: {}, enumerable: true, writable: true },
  })

  /**
   * indicated the current view mode, and optional data about it 
   */
  var viewMode = Object.create(modelPrototype, {
    // value for mode can be 'list' or 'slide'
    'mode': { value: 'list', enumerable: true, writable: true },
    'options': { value: {}, enumerable: true, writable: true },

    'toggleSlide': {
      value: function(image){
        this.mode = 'slide'
        this.options = {
          image: image
        }
        this.notify()
      }
    },

    'toggleList': {
      value: function(){
        this.mode = 'list'
        this.options = {}
        this.notify()
      }
    }
  })

  /**
   * Session models: say if the user is authenticated, who he is...
   */
  var session = Object.create(modelPrototype, {
    'isLogged': {
      value: function(){
        return this._logged
      }
    },
    'username': {
      enumerable: true,
      get: function(){
        return this._username
      } 
    },
    /**
     * tag the user as logged
     */
    'tagAsLogged': {
      value: function(username){
        if (!this._logged){
          console.log('tagHasLogged')
          this._logged = true
          this._username = username
          this.notify()
        }
      }
    },
    /**
     * tag the user an anonymous
     */
    'tagAsAnonymous': {
      value: function(){
        if (this._logged){
          console.log('tagHasAnon')
          delete this._username
          this._logged = false
          this.notify()
        }
      }
    }
  })

  /**
   * the favorites of the user, if it's logged
   */
  var favorites = Object.create(modelPrototype, {

    /**
     * _collection is an associative array imageId => image
     */
    'collection': {
      get: function(){
        return this._collection || {}
      }
    },

    /**
     * clear the collection
     */
    'clear': {
      value: function(){
        this._collection = {}
        this.notify()
      }
    },

    /**
     * replace the current collection by a new
     */
    'replace': {
      value: function(collectionArray){
        this._collection = {}
        this.feed(collectionArray)
      }
    },

    /**
     * add some elements to the current collection
     */
    'feed': {
      value: function(collectionArray){
        for (var i = 0; i < collectionArray.length; i += 1){
          var img = collectionArray[i]
          this._collection[img.id] = img
        }
        this.notify()
      }
    },

    /**
     * Say if an image exist in the user favorites collection
     */
    'contains': {
      value: function(imageId){
        return this._collection.hasOwnProperty(imageId)
      }
    },

    /**
     * remove one image
     */
    'remove': {
      value: function(imageId){
        if (this.contains(imageId)){
          delete this._collection[imageId]
          this.notify()
        }
      }
    }
  })



  searchResults.initialize()
  searchStatus.initialize()
  searchCriteria.initialize()
  viewMode.initialize()
  session.initialize()
  favorites.initialize()


  // Create a sub-namespace 'models'. Add some of the the previous definitions to it.
  photoLib.models = {
    buildImage: buildImage,
    searchResults: searchResults,
    searchCriteria: searchCriteria,
    searchStatus: searchStatus,
    session: session,
    favorites: favorites,
    viewMode: viewMode,
    thumbnailDir: null
  }

  return photoLib

})(photoLib)