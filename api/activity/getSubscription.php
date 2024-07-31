<?php
require "../connect.php";

$order_id = $_GET['id'];
$subscription = mysqli_fetch_object($connection->query("select r.*, u.name, u.first_name from activity_restriction r left join user u on u.id = r.user_id where r.id='$order_id'"));
$connection->close();
echo json_encode($subscription);