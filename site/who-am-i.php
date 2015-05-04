<?php 
session_start();

require_once ('./library/autoload.php');

$session = new \PhotoLibrary\Session\Session();
$responseObj = array();


if ($session->isAuthenticated()){
  $responseObj['authenticated'] = true;
  $responseObj['username'] = $session->getUser()->getName();
}
else {
  $responseObj['authenticated'] = false;
}

echo \PhotoLibrary\Serializer\JsonSerializer::encode($responseObj);
?>