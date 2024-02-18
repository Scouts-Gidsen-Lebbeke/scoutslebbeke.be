<?php
require "connect.php";
$event_id = $_GET['id'];
$event = mysqli_fetch_object($connection->query("select * from event where id='$event_id'"));
$connection->close();
echo json_encode($event);