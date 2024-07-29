<?php
require "../connect.php";

$activity_id = $_GET['id'];
$activity = mysqli_fetch_object($connection->query("select * from activity where id='$activity_id'"));
$activity->location = mysqli_fetch_object($connection->query("select * from location where id='$activity->location_id'"));
$activity->restrictions = mysqli_all_objects($connection, "select r.id, r.branch_id, r.name, r.alter_start, r.alter_end, r.alter_price, b.name as branch_name, b.image from activity_restriction r left join branch b on r.branch_id = b.id where r.activity_id='$activity_id'");
$connection->close();
echo json_encode($activity);