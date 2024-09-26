<?php
require 'init_env.php';

$connection = connect();

function connect(): mysqli {
    global $config;
    $connection = new mysqli($config["DB_HOST"], $config["DB_USERNAME"], $config["DB_PASSWORD"], $config["DB_DATABASE"]);
    mysqli_set_charset($connection, "utf8mb4");
    return $connection;
}

function mysqli_all_objects($connection, $query): array {
    $data = array();
    $result = $connection->query($query);
    while ($obj = mysqli_fetch_object($result)){
        $data[] = $obj;
    }
    $result->close();
    return $data;
}

function mysqli_all_columns($connection, $query): array {
    $data = array();
    $result = $connection->query($query);
    while ($obj = mysqli_fetch_column($result)){
        $data[] = $obj;
    }
    $result->close();
    return $data;
}