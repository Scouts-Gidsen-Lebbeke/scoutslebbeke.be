<?php
require "../connect.php";
$locations = mysqli_all_objects($connection, "select id, name from location");
$connection->close();
echo json_encode($locations);