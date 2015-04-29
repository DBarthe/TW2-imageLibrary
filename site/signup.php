<?php
session_start();

require_once 'library/autoload.php';

$page = 'signup';

$session = new \PhotoLibrary\Session\Session();

if ($session->isAuthenticated()){
  header("Location: /index.php");
  die();
}

$error = false;
$errorMsg = "";

if ($_SERVER['REQUEST_METHOD'] == 'POST'){

  if (isset($_POST['username']) && isset($_POST['password']) && isset($_POST['re-password'])){
    $login = $_POST['username'];
    $password = $_POST['password'];
    $rePassword = $_POST['re-password'];

    if ($password === $rePassword){

      $db = \PhotoLibrary\Shortcuts::getDatabase();
      $user = $db->getUserByLogin($login);
      if (is_null($user) || $user === false){
        if (!is_null($db->createuser($login, $password)) && $session->authenticate($login, $password)){
          header('Location: /index.php');
          die();
        }
        else {
          $errorMsg = 'internal server error';
        }
      }
      else {
        $errorMsg = 'this username is already taken';
      }
    }
    else {
      $errorMsg = 'the two passwords are not equal';
    }
  }
  else {
    $errorMsg = "don't forget to complete the form";
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

  <div id='signup-container'>

    <?php if ($error === true){ ?>
      <p id='signup-error-msg'>Error: <?php echo $errorMsg; ?><p>
    <?php } ?>

    <form name='signupForm' method='post' action='signup.php'>
      <span>Username:</span><input class='signup-input' type='text' name='username'  required/><br />
      <span>Password:</span><input class='signup-input' type='password' name='password' required/><br />
      <span>Password, again:</span><input class='signup-input' type='password' name='re-password' required/><br /><br />

      <input id='signup-button' class='custom-button' type='submit' value='Signup' />
    </form>
      
  </div>



</body>
</html>