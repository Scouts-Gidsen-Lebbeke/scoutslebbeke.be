<?php
require '../getInternalLogin.php';

$user = getCurrentUser(true);
$id = $_GET["id"];
$result = new stdClass();
$result->registration = mysqli_fetch_object($connection->query("select * from activity_registration where id = '$id'"));
if ($result->registration == null) {
    echo json_encode(null);
    return;
}
$result->member = fetchUserById($result->registration->user_id);
$start = new DateTime($result->registration->start);
$start->setTime(0, 0);
$end = new DateTime($result->registration->end);
$end->setTime(23, 59);
$period = $end->diff($start);
$result->registration->days = $period->days + 1;
$activity_id = $result->registration->activity_id;
$result->activity = mysqli_fetch_object($connection->query("select * from activity where id ='$activity_id'"));
$result->organization = fetchOwner();
echo json_encode($result);
$connection->close();
