<?php
include '../getInternalLogin.php';

guardStaff();
$result = new stdClass();
$present = $_GET['present'] == 'true';
$user_id = $_GET['userId'];
$activity_id = $_GET['activityId'];
$result->success = mysqli_query($connection, "update activity_registration set present = '$present' where user_id = '$user_id' and activity_id = '$activity_id'");
echo json_encode($result);
