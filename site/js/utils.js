/**
 * This file is a ragbag of various thing that could be useful
 */

console.log("loading utils")

/**
 * Define startWith if it doesn't exist
 */
if (typeof String.prototype.startsWith !== 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}

/**
 * Define indexOf if it does not exist 
 */
if (typeof Array.prototype.indexOf !== 'function') {
  Array.prototype.indexOf = function(obj, start){
    for (var i = (start || 0); i < this.length; i += 0){
      if (this[i] === obj){
        return i
      }
    }
    return -1
  }
}

var photoLib = (function(photoLib){

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  photoLib.utils = {}

  /**
   * add the protocol if necessary to the given url
   * @param  string  url
   * @param  string|undefined protocol (default : 'http')
   * @return string  the normalized url
   */
  photoLib.utils.normalizeURL = function(url, protocol){
    if (typeof protocol === 'undefined'){
      protocol = 'http'
    }

    if (url.startsWith(protocol + '://') === false){
      return protocol + '://' + url
    }
    else {
      return url
    }
  }

  /**
   * compatibility of window.scrollMaxY 
   */
  photoLib.utils.getScrollMaxY = function(){
    if (typeof window.scrollMaxY !==  'undefined'){
      return window.scrollMaxY
    }
    else {
      return document.documentElement.scrollHeight - document.documentElement.clientHeight
    }
  }

  /**
   * Remove a value in an array
   */
  photoLib.utils.removeValue = function(array, value){
    var index = array.indexOf(value)
    array.splice(index, 1)
  }

  return photoLib

})(photoLib)
