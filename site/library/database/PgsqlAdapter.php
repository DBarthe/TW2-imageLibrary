<?php 

namespace PhotoLibrary\Database;

require_once 'DatabaseAdapterInterface.php';

use PDO;

/**
 * Adapter between my custom ORM and the PostgreSQL PDO library.
 */
class PgsqlAdapter implements DatabaseAdapterInterface {
  
  protected $_config;
  protected $_link;
  protected $_queryHandle;

  /**
   * @param array $config
   *        is an associative array that must contain:
   *        'host', 'database', 'user' and 'password',
   *        optionally: 'port'.
   */
  public function __construct(array $config){
    $this->_config = $config;
  }

  /*
   * Close the connexion when the object is destroyed.
   */
  public function __destruct(){
    $this->disconnect();
  }

  /**
   * @return string the DSN needed for the connexion, corresponding to the configuration.
   */
  private function makeDSN(){
    $host = $this->_config['host'];
    $database = $this->_config['database'];
    $port = $this->_config['port'] or 5432;

    return "pgsql:host=$host;port=$port;dbname=$database";
  }

  /**
   * Connect to the database. If the connexion has already be done, it does nothing.
   * @return boolean true if the connexion succeed.
   * @throws RuntimeException. 
   */
  public function connect(){

    // connect only once
    if (is_null($this->_link)){

      $dsn = $this->makeDSN();
      $user = $this->_config['user'];
      $password = $this->_config['password'];
      $attributes = array(
        PDO::ATTR_PERSISTENT => true,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION // TO REMOVE IN PRODUCTION
      );

      try {
        $this->_link = new PDO($dsn, $user, $password, $attributes);      
      }
      catch (\PDOException $e){
        throw new \RuntimeException($e->getMessage());
      }
    }
    return true;
  }

  /**
   * Close the connexion
   * @return boolean.
   */
  public function disconnect(){
    if (is_null($this->_link)){
      return false;
    }
    $this->_link = null;
    return true;
  }

  /**
   * Execute a raw query.
   * @param  string $query an sql statement, or null to re-use the last query.
   * @param  assoc  $params parameters to safely inject in the query. 
   * @return boolean true on success, false otherwise.
   * @throws InvalidArgumentException if the query argument is not valid.
   * @throws RuntimeException if the query fails.
   */
  public function query($query, array $params = null){

    if (is_null($query)){
      if (is_null($this->_queryHandle)){
        throw new InvalidArgumentException("Error: the query cannot be null here");
      }
    }
    else if (!is_string($query) || empty($query)){
      throw new InvalidArgumentException("Error: invalid query: '$query'");
    }

    // lazy db connection (do nothing if already connected)
    $this->connect();

    try {
      // just re-use the last query if $query is null 
      if (!is_null($query)){
        $this->_queryHandle = $this->_link->prepare($query);
      }
      $ret = $this->_queryHandle->execute($params);
    }
    catch (\PDOException $e){
      throw new \RuntimeException($e->getMessage());
    }
    return $ret;
  }

  
  /**
   * Performs a SELECT statement
   * @param assoc $optional sql select options containing
   *                        - 'fields' (default: '*'')
   *                        - 'where'
   *                        - 'order'
   *                        - 'limit'
   *                        - 'offset'
   * @param assoc $params (see query())
   * @return mixed the number of rows or false 
   */
  public function select($table, array $optional = null, array $params = null){

    if (is_null($optional)){
      $optional = array();
    }

    $fields = (isset($optional['fields']) ? $optional['fields'] : '*');
    $where = (isset($optional['where']) ? $optional['where'] : null);
    $order = (isset($optional['order']) ? $optional['order'] : null);
    $limit = (isset($optional['limit']) ? $optional['limit'] : null);
    $offset = (isset($optional['offset']) ? $optional['offset'] : null);

    $query =
      'SELECT '.$fields.' FROM '.$table
      .(!is_null($where) ? ' WHERE '.$where : '')
      .(!is_null($order) ? ' ORDER BY '.$order : '')
      .(!is_null($offset) ? ' OFFSET '.$offset : '')
      .(!is_null($limit) ? ' LIMIT '.$limit : '');

    if ($this->query($query, $params) == false){
      return false;
    }

    return $this->countRows();
  }

  /**
   * Fetch the next row.
   * @return mixed the row in an associative array or false.
   */
  public function fetch(){
    if (is_null($this->_queryHandle)){
      return false;
    }
    $this->_queryHandle->setFetchMode(PDO::FETCH_ASSOC);
    $row = $this->_queryHandle->fetch();
    return $row;
  }

  /**
   * Fetch all the rows.
   * @return mixed an array of associative arrays or false.
   */
  public function fetchAll(){
    if (is_null($this->_queryHandle)){
      return false;
    }
    $this->_queryHandle->setFetchMode(PDO::FETCH_ASSOC);
    $rows = $this->_queryHandle->fetchAll();
    return $rows;
  }

  /**
   * Perform an INSERT statement.
   * @param  string $table
   * @param  array  $data  an associative array column => value
   * @param  aray $params the params to safely inject
   * @return integer the inserted id
   */
  public function insert($table, array $data, array $params = null, $idColumn = 'id'){

    $columns = implode(',', array_keys($data));
    $values = implode(',', array_values($data));

    $query = 'INSERT INTO '.$table.' ('.$columns.' ) VALUES ('.$values.')';

    $this->query($query, $params);



    return (is_null($idColumn) ? null : $this->getInsertId($table, $idColumn));
  }

  /**
   * Perform an UPDATE statement
   * @param  string     $table
   * @param  array      $data   asscoiative array column => value to set
   * @param  string     $where  where clause or null
   * @param  array|null $params params to safely inject in the query
   * @return int        the number of rows updated
   */
  function update($table, array $data, $where = null, array $params = null){
    $set = array();
    foreach ($data as $column => $value) {
      $set[] = $column.'='.$value;
    }
    $set = implode(',', $set);
    $query = 'UPDATE '.$table.' SET '.$set.(is_null($where) ? '' : (' WHERE '.$where));
    $this->query($query, $params);
    return $this->countRows();
  }


  /**
   * Perform a DELETE statement
   * @param  string     $table
   * @param  string     $where      the condition
   * @param  array|null $params     params to safely inject in the query
   * @return int                    the number of rows deleted
   */ 
  function delete($table, $where, array $params = null){

    $query = 'DELETE FROM '.$table.' WHERE '.$where;
    $this->query($query, $params);
    return $this->countRows();
  }

  /**
   * Get the last inserted id in a table
   * @param  string $table
   * @return mixed the id or null the link has not already be done.
   */
  public function getInsertId($table, $idColumn = 'id'){
    if (is_null($this->_link)){
      return null;
    }
    return $this->_link->lastInsertId($table."_${idColumn}_seq");
  }

  /**
   * @return mixed The number of rows of the last query, or false if there is no previous query.
   */
  public function countRows(){
    if (is_null($this->_queryHandle)){
      return false;
    }
    return $this->_queryHandle->rowCount();
  }
}

?>