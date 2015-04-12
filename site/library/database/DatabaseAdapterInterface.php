<?php

namespace PhotoLibrary\Database;

interface DatabaseAdapterInterface {

  function connect();

  function disconnect();

  function query($query, array $params = null);

  function fetch();

  function fetchAll();

  function select($table, array $optional, array $params = null);

  function insert($table, array $data, array $params = null);

  function update($table, array $data, $where = null, array $params = null);

  function delete($table, $conditions, array $params = null);

  function getInsertId($table);

  function countRows();
}

?>