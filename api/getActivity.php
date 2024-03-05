<?php
require "connect.php";
$activity_id = $_GET['id'];
$activity = mysqli_fetch_object($connection->query("select * from event where id='$activity_id'"));
$activity->location = mysqli_fetch_object($connection->query("select * from location where id='$activity->location_id'"));
$activity->restrictions = mysqli_all_objects($connection, "select * from event_restriction where event_id='$activity_id'");
$connection->close();
echo json_encode($activity);