<?php
session_start();

require_once 'library/autoload.php';

$session = new \PhotoLibrary\Session\Session();

if ($session->isAuthenticated()){
  echo "{ 'authenticated': true, 'user': '".$session->getUser()->getName()."'}";
}
else {
  echo "{ 'authenticated': false }";
}
?>