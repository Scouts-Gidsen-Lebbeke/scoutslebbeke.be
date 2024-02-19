<?php
require "connect.php";
$event_id = $_GET['id'];
$event = mysqli_fetch_object($connection->query("select * from event where id='$event_id'"));
$event->location = mysqli_fetch_object($connection->query("select * from location where id='$event->location_id'"));
$event->restrictions = mysqli_all_objects($connection, "select * from event_restriction where event_id='$event_id'");
$connection->close();
echo json_encode($event);