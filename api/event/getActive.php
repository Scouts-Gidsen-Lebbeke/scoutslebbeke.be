<?php
require "../connect.php";
echo json_encode(mysqli_all_objects($connection, "select * from event where now() < end and now() > open_registration order by start"));
$connection->close();
