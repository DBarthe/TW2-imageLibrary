<?php

require_once 'library/autoload.php';

use PhotoLibrary\Shortcuts;

try{

  $db = Shortcuts::getDatabase();


  echo "------------------------\n";
  $res = $db->getImageById(1);
  var_dump($res);


  echo "------------------------\n";
  $res = $db->getAllAuthors();
  var_dump($res);

  echo "------------------------\n";
  $res = $db->getUserById(1);
  var_dump($res);

  echo "------------------------\n";
  $res = $db->getUserByLogin('toto');
  var_dump($res);

  echo "------------------------\n";
  $res = $db->getAllUsers();
  var_dump($res);

  echo "------------------------\n";
  $newUser = 'michone'.time();
  $newUserId = $db->createUser($newUser, 'viande');
  $res = $db->getUserById($newUserId);
  var_dump($res);

  echo "------------------------\n";
  $res = $db->getAllCategories();
  var_dump($res);

  echo "------------------------\n";
  $db->attachImageToUser(1, $newUserId);
  $res = $db->getUserLibrary($newUserId);
  var_dump($res);

  echo "------------------------\n";
  $db->detachImageFromUser(1, $newUserId);
  $res = $db->getUserLibrary($newUserId);
  var_dump($res);


  echo "------------------------\n";
  $res = $db->getImages(array(
    'text' => 'u',
    //'author' => 'NASA',
    //'userId' => 1,
    //'category' => 'astronomy',
    //'tags' => array('space', 'planet', 'rap'),
    'limit' => 50,
    'offset' => 0
  ));
  var_dump($res);



}
catch (RuntimeException $e){
  print "Erreur !: " . $e->getMessage()."\n";
  die();
}


?>
