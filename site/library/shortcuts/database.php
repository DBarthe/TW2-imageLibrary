<?php
namespace PhotoLibrary\Shortcuts;

require_once (__DIR__.'/../config/config.php');
require_once (__DIR__.'/../database/PgsqlAdapter.php');
require_once (__DIR__.'/../database/DatabaseGateway.php');

use PhotoLibrary\Database\PgsqlAdapter;
use PhotoLibrary\Database\DatabaseGateway;


/**
 * Create the database gateway and return it.
 * If this function is called multiple times, the same object is always returned.
 * @return DatabaseGateway the database gateway
 */
function getDatabase(){
  static $db = null;

  if (is_null($db)){
    global $CONFIG;
    $adapter = new PgsqlAdapter($CONFIG['DATABASE']);
    $db = new DatabaseGateway($adapter);
  }
  return $db;
}

?>