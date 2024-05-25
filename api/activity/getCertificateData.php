<?php
require 'init_subscription.php';

$user = getUser(true);
$id = $_GET["id"];
$result = new stdClass();
$result->member = $user;
$result->registration = mysqli_fetch_object($connection->query("select * from activity_registration where id = '$id'"));
$start = new DateTime($result->registration->start);
$start->setTime(0, 0);
$end = new DateTime($result->registration->end);
$end->setTime(23, 59);
$period = $end->diff($start);
$result->registration->days = $period->days + 1;
$activity_id = $result->registration->activity_id;
$result->activity = mysqli_fetch_object($connection->query("select * from activity where id ='$activity_id'"));
$result->organization = (object) array(
    "name" => $config["ORGANIZATION_NAME"],
    "address" => $config["ORGANIZATION_ADDRESS"],
    "email" => $config["ORGANIZATION_EMAIL"],
    "signatory" => $config["ORGANIZATION_SIGNATORY"],
);
echo json_encode($result);
$connection->close();
