<?php
require '../getInternalLogin.php';

guardStaff();
$id = $_GET["id"];
$result = mysqli_all_objects($connection, "select * from event_registration where event_id = '$id' and status = 'paid' order by date");
echo json_encode($result);
$connection->close();
