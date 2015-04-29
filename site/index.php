<!DOCTYPE HTML><?php
session_start();

require_once 'library/autoload.php';

$page = 'index';

$session = new \PhotoLibrary\Session\Session();

$db = \PhotoLibrary\Shortcuts::getDatabase();

$authorList = $db->getAllAuthors();
if (!is_array($authorList)){
  $authorList = array();
}

$categoryList = $db->getAllCategories();
if (!is_array($categoryList)){
  $categoryList = array();
}

$userList = $db->getAllUsers();
if (!is_array($userList)){
  $userList = array();
}?>
<html lang='en-US'>
<head>
  <meta charset='utf-8'>
  <meta name=viewport content="width=device-width, initial-scale=1">

  <link rel="stylesheet" type="text/css" href="css/global.css">

  <script type="text/javascript" src='./js/utils.js'></script>
  <script type="text/javascript" src='./js/models.js'></script>
  <script type="text/javascript" src='./js/services.js'></script>
  <script type="text/javascript" src='./js/controllers.js'></script>
  <script type="text/javascript" src='./js/views.js'></script>

  <title>PhotoLibrary</title>
</head>
<body>

  <?php include 'views/header.php'; ?>

  <?php include 'views/sidebar.php'; ?>
  
 

  <div id='main-container'>

    <div id='image-grid-container'>
    </div>

    <div id='more-container'>
      <button class='custom-button' id='more-button'>Show more</button>
      <p id='no-more-text'>No more results to display</p>
    </div>
  </div>

  <div unselectable="on" class='unselectable' id='slide-container'>
    <div unselectable="on" class='unselectable' id='slide-bg'></div> 

    <div unselectable="on" class='unselectable' id='slide-content'>

      <div unselectable="on" class='unselectable' id='slide-image-container'>
        <img unselectable="on" class='unselectable' id='slide-image'>
      </div>

      <div id='slide-exit-button-out'>
        <div id='slide-exit-button-in'></div>
      </div>


      <div id='slide-prev-button-out'>
        <div id='slide-prev-button-mid'>
          <div id='slide-prev-button-in'></div>
        </div>
      </div>

      <div id='slide-succ-button-out'>
        <div id='slide-succ-button-mid'>
          <div id='slide-succ-button-in'></div>
        </div>
      </div>

    </div>
  </div>

  <footer></footer>

</body>
</html>