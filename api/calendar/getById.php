<?php
require "../getInternalLogin.php";
$id = $_GET['id'];
$calendar = mysqli_fetch_object($connection->query("select * from calendar where id = '$id'"));
$connection->close();
echo json_encode($calendar);