/*
 * This file contains the controllers of the client.
 */

var photoLib = (function(photoLib){

  if (typeof photoLib === 'undefined'){
    photoLib = {}
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
      that.processSubmit()
      return false
    }, false)
  }

  searchResultsCtrl.processSubmit = function(){

    // TODO
    console.log('processSubmit')
    console.log(this.textInput.value)
    console.log(this.authorInput.value)
    console.log(this.categoryInput.value)
    console.log(this.userInput.value)
    console.log(this.tagsInput.value)
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

    manager.addCtrl(searchResultsCtrl);
    manager.initializeThem();
    manager.bindThem();
  }

  window.addEventListener('load', initialize, false);

})(photoLib);