/*
 * This file contains various services used by the client.
 */

 var photoLib = (function(photoLib){


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

  AsyncGetRequest.prototype._buildUrl = function(baseUrl, params){
    this._buildQueryString()
    this.url = baseUrl + '?' + this.queryString
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

    req.addEventListener('load', this.onLoad, false)
    req.addEventListener('progress', this.onProgress, false)
    req.addEventListener('error', this.onFailure, false)

    req.open('get', this.url)
    req.send()
  }


  photoLib.services = {
    AsyncGetRequest: AsyncGetRequest
  }

  }

 })(photoLib)