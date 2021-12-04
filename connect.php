<?php
$config = parse_ini_file('db.ini');
//$connection = mysqli_connect($config["host"], $config["user"], $config["password"]);
$connection = new mysqli($config["host"], $config["user"], $config["password"], $config["database"]);
mysqli_set_charset($connection, "utf8");
//$db = mysqli_select_db($connection, "ID318704_main");
function sec($data){
    global $connection;
    return mysqli_real_escape_string($connection, stripslashes($data));
}
