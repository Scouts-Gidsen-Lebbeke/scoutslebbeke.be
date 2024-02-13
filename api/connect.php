<?php
require 'init_env.php';

$connection = new mysqli($config["main.db.host"], $config["main.db.user"], $config["main.db.password"], $config["main.db.database"]);
mysqli_set_charset($connection, "utf8");

function mysqli_all_objects($connection, $query): array {
    $data = array();
    $result = $connection->query($query);
    while ($obj = mysqli_fetch_object($result)){
        $data[] = $obj;
    }
    $result->close();
    return $data;
}