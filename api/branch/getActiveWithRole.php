<?php
require "../connect.php";
$branches = mysqli_all_objects($connection, "select * from branch where status = 'ACTIVE'");
$connection->close();
echo json_encode($branches);