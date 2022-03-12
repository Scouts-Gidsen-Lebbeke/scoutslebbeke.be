<?php
$config = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/config.ini');
$connection = new mysqli($config["main.db.host"], $config["main.db.user"], $config["main.db.password"], $config["main.db.database"]);
mysqli_set_charset($connection, "utf8");
function sec($data){
    global $connection;
    return mysqli_real_escape_string($connection, stripslashes($data));
}
