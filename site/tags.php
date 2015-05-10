<?php
/*
 * Add or remove tags on image
 */
require_once 'library/autoload.php';

$db = \PhotoLibrary\Shortcuts::getDatabase();

if (isset($_GET['action']) && isset($_GET['id']) && isset($_GET['tag'])){
  $action = $_GET['action'];
  $id = $_GET['id'];
  $tag = $_GET['tag'];

  $tags = explode(' ', $tag);

  foreach ($tags as $t) {
    if (!empty($t)){
      if ($action == 'add'){
        $db->addImageTag($id, $tag);
        echo "add";
      }
      else if ($action == 'remove'){
        $ret = $db->removeImageTag($id, $tag);
        echo "remove $ret";
      }
      else {
        echo "nothing";
      } 
    }
  }
}
else {
  echo "error";
}

?>