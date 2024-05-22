<?php
require "../connect.php";
echo json_encode(mysqli_all_objects($connection, "select * from branch where active"));
$connection->close();