<?php
$config = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/config.ini');
$connection = new mysqli($config["host"], $config["user"], $config["password"], $config["database"]);
mysqli_set_charset($connection, "utf8");
function sec($data){
    global $connection;
    return mysqli_real_escape_string($connection, stripslashes($data));
}
