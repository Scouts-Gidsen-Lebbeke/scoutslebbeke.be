<?php
require "../connect.php";
$periods = mysqli_all_objects($connection, "select id, name, now() between start and end as 'active' from calendar_period");
$connection->close();
echo json_encode($periods);
