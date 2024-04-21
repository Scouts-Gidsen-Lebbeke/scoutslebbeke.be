<?php
require "../getInternalLogin.php";
$branch = $_GET['branch'];
$user = getUser();
$admin = $user != null && $user->level->isAdmin();
$staff_of_branch = $user != null && $user->level->isStaff() && $user->staff_branch == $branch;
$calendar = null;
$period_id = @$_GET['period'];
$period = null;
if ($period_id == null) {
    $period = mysqli_fetch_object($connection->query("select * from calendar_period where now() between start and end"))->id;
} else {
    $period = mysqli_fetch_object($connection->query("select * from calendar_period where id = '$period_id'"));
}
if ($period != null) {
    $calendar = mysqli_fetch_object($connection->query("select * from calendar where branch_id = '$branch' and period_id = '$period->id'"));
    if ($calendar != null) {
        $calendar->period = $period;
        $calendar->editable = $admin || $staff_of_branch;
        $calendar->items = mysqli_all_objects($connection, "select * from calendar_item where calendar_id = '$calendar->id' or calendar_period_id = '$period->id' order by fromDate");
        foreach ($calendar->items as $item) {
            if ($item->location_id != null) {
                $item->location = mysqli_fetch_object($connection->query("select * from location where id='$item->location_id'"));
            }
            $item->editable = $admin || ($item->calendar_id != null && $staff_of_branch);
        }
    }
}
$connection->close();
echo json_encode($calendar);
