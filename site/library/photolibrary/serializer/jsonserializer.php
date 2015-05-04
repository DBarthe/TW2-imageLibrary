<?php
namespace PhotoLibrary\Serializer;

class JsonSerializer implements SerializerInterface {

  public static function encode($value){
    $res = json_encode($value);
    return ($res === false ? null : $res);
  }

  public static function decode($json){
    return json_decode($json);
  }
}
?>