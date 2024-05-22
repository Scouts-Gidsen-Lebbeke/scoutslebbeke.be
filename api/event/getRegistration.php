<?php
require "../connect.php";

$order_id = $_GET['id'];
$registration = mysqli_fetch_object($connection->query("select * from event_registration where id='$order_id'"));
$connection->close();
echo json_encode($registration);