<?php
/*
 * Add or remove image for user favorites
 */

session_start();

require_once 'library/autoload.php';

$session = new \PhotoLibrary\Session\Session();
$db = \PhotoLibrary\Shortcuts::getDatabase();

if ($session->isAuthenticated()){

  if (isset($_GET['action']) && isset($_GET['id'])){
    $action = $_GET['action'];
    $id = $_GET['id'];


    if ($action == 'add'){
      $db->attachImageToUser($id, $session->getUser()->getId());
    }
    else if ($action == 'remove'){
      $db->detachImageFromUser($id, $session->getUser()->getId());
    }
  }
}
?>