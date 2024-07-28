<?php
require "../getInternalLogin.php";

guardStaff();
$result = new stdClass();
$result->activities = mysqli_all_objects($connection, "select * from activity");
foreach ($result->activities as $activity) {
    if (strtotime($activity->close_subscription) < time()) {
        $activity->status = "Afgesloten";
    } else if (strtotime($activity->open_subscription) > time()) {
        $activity->status = "Nog niet geopend";
    } else {
        $activity->status = "Open";
    }
    $activity->subscriptions = mysqli_num_rows($connection->query("select id from activity_registration where activity_id = '$activity->id' and payment_id is not null and status not in ('canceled', 'expired', 'failed')"));
}
echo json_encode($result);
$connection->close();