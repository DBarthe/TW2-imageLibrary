<?php

namespace PhotoLibrary\Session;

class User {

  private $_id;
  private $_name;

  public function __construct($userRow){
    $this->_id = $userRow['id'];
    $this->_name = $userRow['login'];
  }

  public function getName(){
    return $this->_name;
  }

  public function getId(){
    return $this->_id;
  }
}

?>