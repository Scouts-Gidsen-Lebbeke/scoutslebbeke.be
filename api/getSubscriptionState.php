<?php
require 'getInternalLogin.php';

$event_id = $_GET['id'];
$user = fetchUser($sgl_id);
$registration = mysqli_fetch_object($connection->query("select * from event_registration where user_id = '$user->id' and event_id = '$event_id' order by date desc limit 1"));
echo json_encode($registration);
