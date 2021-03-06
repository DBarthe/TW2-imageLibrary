/*
 * This file contains the views of the client
 */

 var photoLib = (function(photoLib){

  console.log("loading views")

  if (typeof photoLib === 'undefined'){
    photoLib = {}
    console.log("create photoLib")
  }

  /**
   * var elements : store static DOM elements
   */
  var elements = {}
  elements.initialize = function(){
    this.container = document.getElementById("main-container")
    this.welcomeContainer = document.getElementById("welcome-container")
    this.imageGridContainer = document.getElementById("image-grid-container")
    this.moreContainer = document.getElementById("more-container")
    this.moreButton = document.getElementById("more-button")
    this.noMoreText = document.getElementById("no-more-text")
    this.slideContainer = document.getElementById("slide-container")
    this.slideImage = document.getElementById('slide-image')
    this.slideImageContainer = document.getElementById('slide-image-container')
    this.slideTagList = document.getElementById('slide-taglist')
  }

  /**
   * var welcomeView : displayed at the start, before the user starts a search
   */
   var welcomeView = Object.create(Object.prototype)

   welcomeView.update = function(){
    elements.imageGridContainer.style.display = 'none'
    elements.welcomeContainer.style.display = 'block'
   }

  /**
   * var imageListView : the standard view mode (grid of image)
   */
  var imageListView = Object.create(Object.prototype)

  imageListView.initialize = function(){
    var that = this
  }

  imageListView.update = function(){
    elements.welcomeContainer.style.display = 'none'
    elements.slideContainer.style.display = 'none'

    if (photoLib.models.searchStatus.str == 'success'){
      this.displayImageList()
    }
  }

  imageListView.displayImageList = function(){
    var imageList = photoLib.models.searchResults.collection

    if (imageList.length == 0){
      return this.displayEmptyList()
    }

    elements.imageGridContainer.style.display = 'block';
    elements.moreContainer.style.display = 'block';


    var html = ""
    html += "<ul id='image-grid'>"
    for (var i = 0; i < imageList.length; i += 1){
      var img = imageList[i]
        , thumbUrl = 'thumbnails/' + img.thumbnail

      html += "<li>"
        + '<span class="image-thumb-helper">'
        + '<div class="image-thumb-container">'
        + '<img class="image-thumb" src="' + thumbUrl + '">'
        + '<div class="image-thumb-info">'
      html += '<p class="image-title">' + img.title + '<p>'
      html += '<p>by <a ' + (img.authorUrl ? ('href="' + photoLib.utils.normalizeURL(img.authorUrl) + '" ') : "")
        + 'class="image-info-elem">'+img.author+'</a> - '
      html += '<span class="image-info-elem">'+img.size.width+'x'+img.size.height+'</span><p>'
      html += this.makeLicenseElement(img.license)
      html += '<p>' // + '<a class="image-info-button" href="'+img.url+'">Visit page</a>'
      html += '<a onclick="photoLib.controllers.thumbButtons.viewImage(' + img.id +')" '
        + 'class="image-info-button"  href="#">View image</a></p>'

      if (photoLib.models.session.isLogged()){
        if (photoLib.models.favorites.contains(img.id)){
          html += '<button class="add-btn added"'
            + 'onclick="photoLib.controllers.favorites.removeFromFavorites('+img.id+')">'
            + '<span></span></button>'
        }
        else {
          html += '<button class="add-btn"'
            + 'onclick="photoLib.controllers.favorites.addToFavorites('+img.id+')">'
            + '<span></span></button>' 
        }
      }
      html += '</div>'
        + "</div>"
        + '</span>'
        + "</li>"
    }

    html += "</ul>"

    elements.imageGridContainer.innerHTML = html

    if (photoLib.models.searchResults.finished){
      elements.moreButton.style.display = 'none'
      elements.noMoreText.style.display = 'initial'
    } else {
      elements.moreButton.style.display = 'initial'
      elements.noMoreText.style.display = 'none'
    }
  }

  imageListView.makeLicenseElement = function(license){
    var makeImg = function(file, alt){
      return '<img src="' + file + '" alt="' + alt + '" class="cc-thumb">'
    }

    var helper = function(name, alt){
      return (license[name] ? makeImg('images/' + name + '.svg', alt) : '')
    }

    var html = makeImg('images/cc.svg', 'Creative Commons')
    html += helper('by', 'Attribution')
    html += helper('sa', 'Share-alike')
    html += helper('nc', 'Non-commercial')
    html += helper('nd', 'No Derivative Works')
    return html
  }

  imageListView.displayEmptyList = function(){
    elements.moreContainer.style.display = 'none';
    elements.imageGridContainer.innerHTML =
      "<p class='info-text'>Your search did not match any image</p>"
  }

  /**
   * var imageSlideView : view of the 'slide show' mode
   */
  var imageSlideView = Object.create(Object.prototype)

  imageSlideView.initialize = function(){}

  imageSlideView.update = function(){
    var imgObj = photoLib.models.viewMode.options.image
      , imgElt = elements.slideImage

    var drawImage = function(){
      var width = imgElt.naturalWidth
        , height = imgElt.naturalHeight
        , scale = 1

      if (width > window.innerWidth || height > window.innerHeight){
        scale = Math.min(window.innerWidth / width, window.innerHeight / height)
      }

      if (scale < 1){
        width *= scale
        height *= scale        
      }

      var x = window.innerWidth / 2 - width / 2
        , y = window.innerHeight / 2 - height / 2

      elements.slideImageContainer.style.width = width + 'px' 
      elements.slideImageContainer.style.height = height + 'px'
      elements.slideImageContainer.style.top = y + 'px'
      elements.slideImageContainer.style.left = x + 'px'
      elements.slideImageContainer.style.visibility = 'visible'
    }

    var tagListHTML = ''
    for (var i = 0; i < imgObj.tagList.length; i += 1){
      var tag = imgObj.tagList[i]
      if (tag.length > 0){
        tagListHTML += '<span class="slide-tag">' + tag
        tagListHTML += '<span class="slide-rm-tag"'
          + 'onclick="photoLib.controllers.slideShow.removeTag(\'' + tag + '\')"'
          +' class="slide-tag-remove">x</span>'
        tagListHTML += '</span>'
      }
    }
    elements.slideTagList.innerHTML = tagListHTML;

    if (imgElt.src != imgObj.url){
      // elements.slideImageContainer.style.visibility = 'hidden'
      elements.slideContainer.style.display = 'block'
      elements.slideImage.onload = drawImage
      imgElt.src = imgObj.url
    }
    else {
      elements.slideContainer.style.display = 'block'
      drawImage()      
    }
  }

  /**
   * var viewManager: manage all the views
   */
  var viewManager = Object.create(Object.prototype)

  viewManager.initialize = function(){
    var that = this

    elements.initialize()

    imageListView.initialize()
    imageSlideView.initialize()

    this.observerIds = {
      'searchStatus': photoLib.models.searchStatus.attach(function(){
        that.update()
      }),
      'viewMode': photoLib.models.viewMode.attach(function(){
        that.update()
      }),
      'favorites': photoLib.models.favorites.attach(function(){
        that.update()
      })
    }

    window.addEventListener('resize', function(){
      that.update()
    }, false)

    this.update() // first update
  }

  viewManager.update = function(){

    if (photoLib.models.searchStatus.str == 'none'){
      welcomeView.update()
    }
    else {
      imageListView.update()
    }

    if (photoLib.models.viewMode.mode == 'slide'){
      imageSlideView.update()
    }
  }

  window.addEventListener('load', function(){ viewManager.initialize() }, false)

  return photoLib
})(photoLib)
