<?php
session_start();

require_once 'library/autoload.php';

$page = 'login';

$session = new \PhotoLibrary\Session\Session();

if ($session->isAuthenticated()){
  header("Location: /index.php");
  die();
}

$error = false;

if ($_SERVER['REQUEST_METHOD'] == 'POST'){

  if (isset($_POST['username']) && isset($_POST['password'])){
    $login = $_POST['username'];
    $password = $_POST['password'];

    if ($session->authenticate($login, $password) === true){
      header("Location: /index.php");
      die();
    }
  }

  $error = true;
}
?>
<!DOCTYPE HTML>
<html lang='en-US'>
<head>
  <meta charset='utf-8'>
  <meta name=viewport content="width=device-width, initial-scale=1">

  <link rel="stylesheet" type="text/css" href="css/global.css">

  <title>PhotoLibrary</title>
</head>
<body>

  <?php include 'views/header.php'; ?>
  
  
  <div id='login-container'>

    <?php if ($error === true){ ?>
      <p id='login-error-msg'>Error: invalid username or password<p>
    <?php } ?>

    <form name='loginForm' method='post' action='login.php'>
      <span>Username:</span><input class='login-input' type='text' name='username' required/><br />
      <span>Password:</span><input class='login-input' type='password' name='password' required/><br /><br />
      <input id='login-button' class='custom-button' type='submit' value='Login' />
    </form>
      
  </div>



</body>
</html>