/*
 * This file contains the views of the client
 */

 var photoLib = (function(photoLib){

  console.log("loading views")

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  // var viewPrototype = Object.create(Object.prototype, {
  //   'initialize': { writable: true },
  //   'update': { writable: true },
  //   'activate': { writable: true },
  //   'deactivate': { writable: true },
  // })

  var imageListView = Object.create(Object.prototype);

  imageListView.initialize = function(){

    var that = this
      
    this.container = document.getElementById('main-container')

    this.searchResultObserverId = photoLib.models.searchResults.attach(function(){
      that.update()
    })

  }

  imageListView.update = function(){
    console.log('update')
    var imageList = photoLib.models.searchResults.collection
    var html = "<ul>"
    for (var i = 0; i < imageList.length; i += 1){
      var img = imageList[i]
      var itemHtml = '<img src="' + img.url + '"></img>'
      html += "<li>" + itemHtml + "</li>"
    }
    html += "</ul>"
    console.log(html);
    this.container.innerHTML = html;
  }

  function initialize(){
    imageListView.initialize();
    imageListView.update();
  }

  window.addEventListener('load', initialize, false)

  return photoLib
})(photoLib)
