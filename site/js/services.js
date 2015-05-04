/*
 * This file contains various services used by the client.
 */

 var photoLib = (function(photoLib){

  console.log("loading services")

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  /**
   * Constructor of the asynchronous get request service.
   */
  function AsyncGetRequest(baseUrl, params){
    this.onLoad = undefined
    this.onProgress = undefined
    this.onFailure = undefined

    this.baseUrl = baseUrl
    this.params = params

    this.url = undefined
    this.queryString = undefined
  }

  AsyncGetRequest.prototype._buildUrl = function(){
    this.url = this.baseUrl
    if (typeof this.params !== 'undefined'){
      this._buildQueryString()
      this.url += '?' + this.queryString
    }
    console.log('url: ' + this.url)
  }

  AsyncGetRequest.prototype._buildQueryString = function(){
    var stringArray = []
    for (var d in this.params){
      if (this.params.hasOwnProperty(d)){
        stringArray.push(encodeURIComponent(d)
          + "=" + encodeURIComponent(this.params[d]))
      }
    }
    this.queryString = stringArray.join("&")
  }

  AsyncGetRequest.prototype.send = function(){
    this._buildUrl()

    var req = new XMLHttpRequest()

    this.onLoad && req.addEventListener('load', this.onLoad, false)
    this.onProgress && req.addEventListener('progress', this.onProgress, false)
    this.onError && req.addEventListener('error', this.onFailure, false)
    this.onEnd && req.addEventListener('loadend', this.onEnd, false)

    req.open('get', this.url)
    req.send()
  }

  photoLib.services = {
    AsyncGetRequest: AsyncGetRequest
  }

  return photoLib

 })(photoLib)