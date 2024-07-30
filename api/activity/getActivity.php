<?php
include "restrictionLogic.php";

$activity_id = $_GET['id'];
$activity = mysqli_fetch_object($connection->query("select * from activity where id='$activity_id'"));
$activity->location = mysqli_fetch_object($connection->query("select * from location where id='$activity->location_id'"));
$activity->restrictions = mysqli_all_objects($connection, "select * from activity_restriction r where r.activity_id='$activity_id'");
$activity->branches = lookupBranches($activity->restrictions);
$connection->close();
echo json_encode($activity);