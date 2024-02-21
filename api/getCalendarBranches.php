<?php
require "connect.php";
$branches = mysqli_all_objects($connection, "select * from branch where role_id is not null and active");
$connection->close();
echo json_encode($branches);