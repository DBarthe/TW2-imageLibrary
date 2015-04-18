<?php

namespace PhotoLibrary;

use \PhotoLibrary\Database;

class Shortcuts {

  /**
   * Create the database gateway and return it.
   * If this function is called multiple times, the same object is always returned.
   * @return DatabaseGateway the database gateway
   */
  public static function getDatabase(){
    static $db = null;

    if (is_null($db)){
      $adapter = new Database\PgsqlAdapter(\PhotoLibrary\Config::$DATABASE);
      $db = new Database\DatabaseGateway($adapter);
    }
    return $db;
  }

  /**
   * Giving an image row, return its thumbnail filename (without path).
   */
  public static function getThumbnailName($imageRow){
    return $imageRow['id'].'.'.\PhotoLibrary\Config::$THUMBNAILS_EXT;
  }
}

?>