<?php
require "connect.php";
$activities = mysqli_all_objects($connection, "select id, name from activity");
$connection->close();
echo json_encode($activities);