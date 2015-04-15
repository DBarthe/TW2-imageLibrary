<?php


define('CLASS_DIR', 'library');

function autoload($className){
  require_once ($className.'.php');
}

set_include_path(get_include_path().PATH_SEPARATOR.CLASS_DIR);
spl_autoload_extensions('.php');
spl_autoload_register();

?>