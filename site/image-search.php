<?php
require 'library/autoload.php';

use \PhotoLibrary\WebService\ImageSearch;
use \PhotoLibrary\Serializer\JsonSerializer;

$responseObj = ImageSearch::executeRequest($_GET);
$responseJson = JsonSerializer::encode($responseObj);

if (is_null($responseJson)){
  header('HTTP/1.1 500 Internal Server Error');
}
else {
  echo $responseJson;
}
?>