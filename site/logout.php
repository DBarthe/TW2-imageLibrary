<?php
session_start();

require_once 'library/autoload.php';

$session = new \PhotoLibrary\Session\Session();

if ($session->isAuthenticated()){
  $session->logout();
}
header("Location: ./index.php");
die();
?>