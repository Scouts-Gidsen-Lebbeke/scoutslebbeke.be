<?php
require "../getInternalLogin.php";
guardStaff();
$id = $_GET['id'];
$succes = mysqli_query($connection, "delete from calendar_item where id = '$id'");
$connection->close();
echo json_encode($succes);
