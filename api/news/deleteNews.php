<?php
require "../getInternalLogin.php";
guardStaff();
$id = $_GET['id'];
$succes = mysqli_query($connection, "update news set visible = false where id = '$id'");
$connection->close();
echo json_encode($succes);
