/*
 * This file contains the model part in the client-side. 
 */

// within namespace 'photoLib'
var photoLib = (function(photoLib){

  if (typeof photoLib === 'undefined'){
    photoLib = {}
  }

  /**
   * this is the prototype that implements the observer design pattern
   */
  var modelPrototype = Object.create(Object.prototype, {
 
    'nextObserverId': { value: 0, writable: true, enumerable: true },

    'observerMap': { value: {}, writable: true, enumerable: true },
 
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
        this.observerMap[id] = callback
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
          if (this.observer.hasOwnProperty(id)){
            this.observerMap[id]({ observerId: id, model: this })
          }
        }
      }
    }
  })

  var imageSetterHelper = function(img, property, value, typesExpected){

    typesExpected = [].typeExpected;

    for (var i = 0; i < typesExpected.length; i += 1){
      if (typeof value === typesExpected[i]){
       img['_' + property] = value
       return;
      }
    }

    throw 'error: invalid image ' + poperty
  }

  /**
   * This is an image prototype. Others models like searchResults
   * that maintain a collection of image will depends on it.
   */
  var imagePrototype = Object.create(Object.prototype, {
    '_id': { writable: true, enumerable: true },
    'id': {
      get: function(){ return this._id },
      set: function(id){ imageSetterHelper(this, 'id', id, 'number') }
    },

    '_url': { writable: true, enumerable: true },
    'url': {
      get: function(){ return this._url },
      set: function(url){ imageSetterHelper(this, 'url', url, 'string') }
    },

    '_size': { writable: true, enumerable: true },
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

    '_thumbnail': { writable: true, enumerable: true },
    'thumbnail': {
      get: function(){ return this._thumbnail },
      set: function(thumbnail){ imageSetterHelper(this, 'thumbnail', thumbnail, 'string') }
    },

    '_author': { writable: true, enumerable: true },
    'author': {
      get: function(){ return this._author },
      set: function(author){ imageSetterHelper(this, 'author', author, 'string') }
    },

    '_authorUrl': { writable: true, enumerable: true },
    'authorUrl': {
      get: function(){ return this._authorUrl },
      set: function(authorUrl){ imageSetterHelper(this, 'authorUrl', authorUrl, ['string', 'undefined']) }
    },

    '_title': { writable: true, enumerable: true },
    'title': {
      get: function(){ return this._title },
      set: function(title){ imageSetterHelper(this, 'title', title, 'string') }
    },

    '_categoryList': { writable: true, enumerable: true },
    'categoryList': {
      get: function(){ return this._categoryList },
      set: function(categoryList){
        if (typeof categoryList === 'undefined' || categoryList.constructor !== Array){
          throw 'error: invalid image categoryList';
        }
        this._categoryList = categoryList
      }
    },

    '_tagList': { writable: true, enumerable: true },
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

  /**
   * Build an image, checking the validity of the given values.
   * @param  object values   the values of the wanted images, will be validate, all field are required
   * @return image  an image object
   * @throws an exception if 'values' is not valid.
   */
  var imageBuilder = function(values){
    var img = Object.create(imagePrototype);
    
    for (var property in imagePrototype){
      if (imagePrototype.hasOwnProperty(property)){
        img[property] = values[prototype];
      }
    }

    return img
  }

  /**
   * Create a searchResults model prototype, used to store the collection of images
   * that match the filters and have to be displayed, depending of the current viewMode
   */
  var searchResultsPrototype = Object.create(modelPrototype, {

    // the collection of images
    '_collection': { value: [], writable: true, enumerable: true },

    // collection hiden getter and setter
    'collection': {
      get: function(){
        return this._collection
      },

      // this setter calls this.notify to inform the obervers that the model has changed
      set: function(collection){
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

  // Create a sub-namespace 'models'. Add some of the the previous definitions to it.
  photoLib.models = {
    imageBuilder: imageBuilder,
    searchResults: Object.create(searchResultsPrototype),
    session: null,
    userCollection: null,
    viewMode: null,
    thumbnailDir: null
  }

})(photoLib)