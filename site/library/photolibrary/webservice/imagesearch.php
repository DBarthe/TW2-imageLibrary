<?php
namespace PhotoLibrary\WebService;

class ImageSearch {

  /**
   * Execute the request
   * @return array an associative array that can be serialized
   */
  public static function executeRequest(array $get){

    $response = array();

    // timestamp is more consistent than string representation
    $response['date'] = time(); 
    $response['thumbnail_dir'] = \PhotoLibrary\Config::$THUMBNAILS_DIR;

    $criteria = ImageSearch::_parseGetQuery($get);
    if (is_null($criteria)){
      return ImageSearch::_failure($response);
    }

    $result = ImageSearch::_searchImages($criteria);
    if (is_null($result)){
      return _failure($response);
    }

    return ImageSearch::_success($response, $result);
  }

  private static function _failure($response){
    $response['status'] = 'error';
    $response['result'] = array();
    return $response;
  }

  private static function _success($response, $result){
    $response['status'] = 'ok';
    $response['result'] = $result;
    return $response;
  }


  /**
   * Parse the $_GET variable and return a criteria array usable with _searchImage()
   */
  private static function _parseGetQuery(array $get){
    $criteria = array();
    $error = false;

    $helper =
      function($nameGet, $nameCriteria = null, $f = null)
      use(&$criteria, &$get){
        if (is_null($nameCriteria)){
          $nameCriteria = $nameGet;
        }
        if (isset($get[$nameGet])){
          $value = $get[$nameGet];
          if (!is_null($f)){
            $value = $f($value);
          }
          $criteria[$nameCriteria] = $value;
        }
    };

    $helper('category');
    $helper('author');
    $helper('keywords', 'tags', function($s){ return explode(' ', $s); });
    $helper('collection', 'userId', function($login) use(&$error){
      $db = \PhotoLibrary\Shortcuts::getDatabase();
      $user = $db->getUserByLogin($login);
      if (is_null($user) || $user === false){
        $error = true;
        return null;
      }
      return $user['id'];
    });
    $helper('from', 'offset');
    $helper('limit');
    $helper('withId');
    $helper('text');

    var_dump($error);

    var_dump($criteria);

    return ($error ? null : $criteria);
  }


  /**
   * Search images according to criteria.
   * @param  array $criteria an associaive array that may contain:
   *                           - category
   *                           - author
   *                           - tags (array of tags)
   *                           - user (an user login)
   *                           - from
   *                           - text
   *                           - limit
   *                           - withId
   * @return array|null     array of image obj to serialize
   */
  private static function _searchImages($criteria){

    $db = \PhotoLibrary\Shortcuts::getDatabase();

    $rows = $db->getImages($criteria);

    if (is_null($rows)){
      return null;
    }

    $withId = (isset($criteria['withId']) && $criteria['withId'] === true);
    $imageArray = array_map(function($row) use ($withId) {
        return ImageSearch::_buildImageObject($row, $withId);
      }, $rows
    );

    return $imageArray;
  }

  /**
   * return an image object to serialize from an image row.
   * @return array    
   */
  private static function _buildImageObject($imageRow, $withId){
    $db = \PhotoLibrary\Shortcuts::getDatabase();

    $categories = $db->getImageCategories($imageRow['id']);
    if (is_null($categories)){
      $categories = array();
    }
    $categories = implode(' ', $categories);

    $tags = $db->getImageTags($imageRow['id']);
    if (is_null($tags)){
      $tags = array();
    }
    $tags = implode(' ', $tags);

    $obj = array(
      'url' => $imageRow['url'],
      'size' => array($imageRow['width'], $imageRow['height']),
      'author' => $imageRow['author_name'],
      'url_author' => $imageRow['author_url'],
      'title' => $imageRow['title'],
      'categories' => $categories,
      'keywords' => $tags,
      'thumbnail' => \PhotoLibrary\Shortcuts::getThumbnailName($imageRow)
    );

    if ($withId){
      $obj['id'] = $imageRow['id'];
    }

    return $obj;
  }
}

?>