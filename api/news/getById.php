<?php
require "../getInternalLogin.php";
$id = $_GET['id'];
$item = mysqli_fetch_object($connection->query("select * from news where id = '$id'"));
$connection->close();
echo json_encode($item);