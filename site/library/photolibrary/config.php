<?php
namespace PhotoLibrary;

class Config {

  public static $DATABASE = array(
    'host' => 'localhost',
    'port' => 5432,
    'database' => 'projet_tw2',
    'user' => 'barth',
    'password' => 'ne5uiJ4h'
  );

  public static $THUMBNAILS_DIR = './thumbnails'; // relative to the SITE ROOT
  public static $THUMBNAILS_EXT = 'png';
}

?>

