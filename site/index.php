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
  <meta charset=utf-8>
  <meta name=viewport content="width=device-width, initial-scale=1">

  <link rel="stylesheet" type="text/css" href="css/global.css">

  <script type="text/javascript" src='./js/models.js'></script>
  <script type="text/javascript" src='./js/controllers.js'></script>

  <title>PhotoLibrary</title>
</head>
<body>

  <header>
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
    <h1>PhotoLib</h1>
  
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

        <button class='sidebar-search-entry' id='sidebar-search-submit'>Refresh</button>
    </div>
  </div>

  <div id='content' class='inline-block'>

 <!--    <p>toto
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>

          <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p>
    <p>fqsdjq
      dqs
      dqsd
      fqsdfqsdfqsdfqsjdfqsdfqsfqd</p> -->

  </div>

  <footer></footer>

</body>
</html>