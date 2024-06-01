<?php
require '../getInternalLogin.php';

$user = getUser(true);
$id = $_GET["id"];
$result = new stdClass();
$result->member = $user;
$result->membership = mysqli_fetch_object($connection->query("select * from membership where id = '$id'"));
$period_id = $result->membership->period_id;
$result->period = mysqli_fetch_object($connection->query("select * from membership_period where id = '$period_id'"));
$result->organization = $organization;
echo json_encode($result);
$connection->close();
