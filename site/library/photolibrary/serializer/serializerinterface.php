<?php 

namespace PhotoLibrary\Serializer;

interface SerializerInterface {

  /**
   * @return mixed       the encoded result or null.
   */
  public static function encode($value);

  /**
   * @return mixed       the decoded result or null.
   */
  public static function decode($encoded);
}

?>