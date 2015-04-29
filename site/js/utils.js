/**
 * This file is a ragbag of various thing that could be useful
 */

console.log("loading utils")

/**
 * Define startWith if it doesn't exists
 */
if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
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

  return photoLib

})(photoLib)
