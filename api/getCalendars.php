<?php
require "connect.php";
$branch = $_GET['branch'];
$period = mysqli_fetch_column($connection->query("select id from calendar_period where now() between start and end"));
$calendar = mysqli_fetch_object($connection->query("select * from calendar where branch_id = '$branch' and period_id = '$period'"));
$calendar->items = mysqli_all_objects($connection, "select * from calendar_item where calendar_id = '$calendar->id' or calendar_period_id = '$period' order by fromDate");
foreach ($calendar->items as $item) {
    if ($item->location_id != null) {
        $item->location = mysqli_fetch_object($connection->query("select * from location where id='$item->location_id'"));
    }
}
$connection->close();
echo json_encode($calendar);
