<!DOCTYPE HTML><?php
session_start();

require_once 'library/autoload.php';

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

  <header>
    <h1>PhotoLib</h1>
    <nav id="topnav">
      <ul>
        <li class='current-nav-li'><a href='./index.php'>Home</a></li>
        <?php
        if ($session->isAuthenticated()){ 
          $userName = $session->getUser()->getName();
          echo "<li><a href='./account.php'>$userName</a></li>"
              ."<li><a href=./logout.php>Logout</a></li>";
        }
        else {
          echo "<li><a href='./login.php'>Login</a></li>"
              ."<li><a href='./signup.php'>Signup</a></li>";
        }
        ?>
      </ul>
    </nav>
  </header>

  
  <div id='sidebar'>
    <div id='sidebar-search-container'>
        <input id="sidebar-text-input"
          class='sidebar-search-entry' type='text' name='text'
          placeholder='Search in titles and tags'/>

        <input type="text" id="sidebar-author-input"
          class='sidebar-search-entry' name="author" list="authorList"
          placeholder='Author'>
        <datalist id="authorList">
          <?php foreach ($authorList as $author){
            echo "<option value='$author'></option>";
          } echo "\n";?>
        </datalist>

        <input type="text" id="sidebar-category-input"
          class='sidebar-search-entry' name="category" list="categoryList"
          placeholder='Category'>
        <datalist id="categoryList">
          <?php foreach ($categoryList as $category){
            echo "<option value='$category'></option>";
          } echo "\n";?>
        </datalist>

        <input type="text" id="sidebar-user-input"
          class='sidebar-search-entry' name="user" list="userList"
          placeholder="User">
        <datalist id="userList">
          <?php foreach ($userList as $user){
            $userName = $user->getName();
            echo "<option value='$userName'></option>";
          } echo "\n";?>
        </datalist>
      
        <input type="text" id="sidebar-tags-input"
          class='sidebar-search-entry' name="tags"
          placeholder='Tags separated by spaces'>

        <button class='custom-button sidebar-search-entry' id='sidebar-search-submit'>Refresh</button>
    </div>
  </div>

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
        </img>
      </div>

      <div id='slide-exit-button-out'>
          <div id='slide-exit-button-in'></div>
      </div>


      <div id='slide-prev-button-out'>
        <div id='slide-prev-button-mid'>
          <div id='slide-prev-button-in'></div>
        </di>
      </div>

      <div id='slide-succ-button-out'>
        <div id='slide-succ-button-mid'>
          <div id='slide-succ-button-in'></div>
        </di>
      </div>

    </div>
  </div>

  <footer></footer>

</body>
</html>