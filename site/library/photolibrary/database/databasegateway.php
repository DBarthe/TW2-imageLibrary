<?php

namespace PhotoLibrary\Database;

/**
 * Gateway between logic side (view, api, ...) and DatabaseAdapter 
 */
class DatabaseGateway {

  private $_adapter;

  public function __construct($adapter){
    $this->_adapter = $adapter;
    $this->_adapter->connect();
  }

  public function __destruct(){
    $this->_adapter->disconnect();
  }

  // TABLE IMAGE
  
  /**
   * Retrieve an image from its id.
   * @param  int $id
   * @return array|null
   */
  public function getImageById($id){
    return $this->_getEntryById('image', $id);
  }

  /**
   * Get images accorging to criteria
   * @param  array $criteria an associative array that may contain:
   *                           - 'author'
   *                           - 'category'
   *                           - 'tags' (an array of tags)
   *                           - 'userId'
   *                           - 'offset'
   *                           - 'limit'
   *                           - 'text' (a text to search in titles and keywords)
   * @return array           an array of images
   */
  public function getImages($criteria){

    $query = 'image';
    $params = array();

    // user
    if (isset($criteria['userId'])){
      $params[':userId'] = $criteria['userId'];
      $query = '(SELECT image.* FROM '.$query.' AS image 
        INNER JOIN user_library AS ul
        ON (ul.image_id = image.id AND ul.user_id = :userId))';
    }

    // author
    if (isset($criteria['author'])){
      $params[':author'] = $criteria['author'];
      $query = '(SELECT image.* FROM '.$query.' AS image 
        WHERE image.author_name = :author)';
    }

    // category
    if (isset($criteria['category'])){
      $params[':category'] = $criteria['category'];
      $query = '(SELECT image.* FROM '.$query.' AS image 
        INNER JOIN image_category AS ic
        ON (ic.image_id = image.id AND ic.category_name = :category))';
    }

    // tags
    if (isset($criteria['tags'])){
      $tags = $criteria['tags'];
      if (count($tags) > 0){
        $tagSet = array();
        foreach ($tags as $index => $tag){
          $paramName = ':tag'.$index; 
          $tagSet[] = $paramName;
          $params[$paramName] = $tag;
        }
        $tagSet = implode(',', $tagSet);
        $query = '(SELECT DISTINCT image.* FROM '.$query.' AS image 
          INNER JOIN image_tag AS it
          ON (image.id = it.image_id AND it.tag IN ('.$tagSet.')))';
      }
    }

    // text
    if (isset($criteria['text'])){
      $params[':pattern'] = '%'.$criteria['text'].'%';
      $query = '(SELECT DISTINCT image.* FROM '.$query.' AS image 
        INNER JOIN image_tag AS it
        ON (image.title LIKE :pattern
        OR (it.image_id = image.id AND it.tag LIKE :pattern)))';
    }

    // if criteria was empty... (except limit and offset)
    if ($query == 'image'){
      $query = 'SELECT * FROM image';
    }

    // limit
    if (isset($criteria['limit'])){
      $params[':limit'] = $criteria['limit'];
      $query = $query.' LIMIT :limit';
    }

    // offset
    if (isset($criteria['offset'])){
      $params[':offset'] = $criteria['offset'];
      $query = $query.' OFFSET :offset';
    }

    echo "query=$query\n";

    // execute the big query
    if ($this->_adapter->query($query, $params) === false){
      return null;
    }

    return $this->_adapter->fetchAll();
  }

  /**
   * Retrieve all the authors (distinct)
   * @return array|null an array of string
   */
  public function getAllAuthors(){
    $ret = $this->_adapter->select('image',
      array('fields' => 'DISTINCT author_name'));

    if ($ret === false){
      return null;
    }

    return array_map(
      function($row){ return $row['author_name']; },
      $this->_adapter->fetchAll());
  }

  // TABLE ACCOUNT
  public function getUserById($id){
    return $this->_getEntryById('account', $id);
  }

  public function getUserByLogin($login){
    return $this->_getEntryByX('account', 'login', $login);
  }

  public function getAllUsers(){
    $ret = $this->_adapter->select('account');

    if ($ret === false){
      return null;
    }

    return array_map(
      function($userRow){
        return new \PhotoLibrary\Session\User($userRow); },
      $this->_adapter->fetchAll()
    );
  }

  public function createUser($login, $password){
    return $this->_adapter->insert('account',
      array('login' => ':login', 'password' => ':password'),
      array(':login' => $login, ':password' => $password));
  }

  // TABLE CATEGORY

  /**
   * Return an array of string
   */
  public function getAllCategories(){
    $ret = $this->_adapter->select('category');

    if ($ret === false){
      return null;
    }

    return array_map(
      function($row){ return $row['name']; },
      $this->_adapter->fetchAll());
  }

  // TABLE IMAGE_CATEGORY
  /**
   * Return an array of string
   */
  public function getImageCategories($imageId){
    $ret = $this->_getEntriesWithX('image_category', 'image_id', $imageId);
    if (is_null($ret)){
      return null;
    }
    return array_map(function($row){ return $row['category_name']; }, $ret);
  }

  // TABLE IMAGE_TAGS 
  public function getImageTags($imageId){
    $ret = $this->_getEntriesWithX('image_tag', 'image_id', $imageId);
    if (is_null($ret)){
      return null;
    }
    return array_map(function($row){ return $row['tag']; }, $ret);
  }

  // TABLE USER_LIBRARY
  /**
   * Return an array of image id
   */
  public function getUserLibrary($userId){
    $entries = $this->_getEntriesWithX('user_library', 'user_id', $userId);
    return array_map(
      function($row){ return $row['image_id']; },
      $entries
    );
  }

  public function attachImageToUser($imageId, $userId){
    $this->_adapter->insert('user_library',
      array('image_id' => ':image_id', 'user_id' => ':user_id'),
      array(':image_id' => $imageId, ':user_id' => $userId),
      null);
  }

  /**
   * the number of images deleted (should be 0 or 1).
   */
  public function detachImageFromUser($imageId, $userId){
    return $this->_adapter->delete('user_library',
      'image_id = :image_id AND user_id = :user_id',
      array(':image_id' => $imageId, ':user_id' => $userId));
  }

  // PRIVATE
  private function _getEntryById($table, $id){
    return $this->_getEntryByX($table, 'id', $id);
  }

  private function _getEntryByX($table, $column, $value){
    $ret = $this->_adapter->select($table,
      array('where' => "$column = :$column"),
      array(":$column" => $value));
    return ($ret === false ? null : $this->_adapter->fetch());
  }

  private function _getEntriesWithX($table, $column, $value){
    $ret = $this->_adapter->select($table,
      array('where' => "$column = :$column"),
      array(":$column" => $value));
    return ($ret === false ? null : $this->_adapter->fetchAll());
  }
}
?>
