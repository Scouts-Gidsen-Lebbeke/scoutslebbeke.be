<?php
require "../connect.php";
echo json_encode(mysqli_all_objects($connection, "select * from activity where now() < end order by start"));
$connection->close();
