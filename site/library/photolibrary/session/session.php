<?php

namespace PhotoLibrary\Session;

require_once 'User.php';
require_once __DIR__.'/../shortcuts/database.php';

class Session {

  private $_user;
  private $_db;

  /**
   * Construct a Session object.
   * It detects if an authenticated session already exists, and attach itself to it. 
   */
  public function __construct(){
    $this->_db = \PhotoLibrary\Shortcuts\getDatabase();
    if (isset($_SESSION['user'])){
      $this->_attachExisting(); 
    }
    else {
      $this->_user = null;
    }
  }

  /**
   * @return boolean true if the user is authenticated.
   */
  public function isAuthenticated(){
    return $this->_user !== null;
  }

  /**
   * @return boolan true if the user is not authenticated.
   */
  public function isAnonymous(){
    return !$this->isAuthenticated();
  }

  /**
   * authenticate the user (do nothing if it is already authenticated).
   * @param  string $login    
   * @param  string $password 
   * @return boolean  true if the user is authenticated at the end, false otherwise.
   */
  public function authenticate($login, $password){
    if ($this->isAuthenticated()){
      return true;
    }
    $user = $this->_db->getUserByLogin($login);
    if (is_null($user) || $user['password'] !== $password){
      return null;
    }
    $this->_user = new User($user);
    $_SESSION['user'] = $login;
    return true;
  }

  /**
   * @return array|null the authenticated user in a associative array or null.
   */
  public function getUser(){
    return $this->_user;
  }

  /**
   * Logout the user.
   */
  public function logout(){
    $this->_user = null;
    unset($_SESSION['user']);
  }

  private function _attachExisting(){
    $login = $_SESSION['user'];
    $this->_user = new User($this->_db->getUserByLogin($login));
  }
}

?>