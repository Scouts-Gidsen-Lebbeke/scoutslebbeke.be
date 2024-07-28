<?php
require "../getInternalLogin.php";

guardStaff();
$result = new stdClass();
$result->events = mysqli_all_objects($connection, "select * from event");
foreach ($result->events as $event) {
    if (strtotime($event->close_registration) < time()) {
        $event->status = "Afgesloten";
    } else if (strtotime($event->open_registration) > time()) {
        $event->status = "Nog niet geopend";
    } else {
        $event->status = "Open";
    }
    $event->registrations = mysqli_num_rows($connection->query("select id from event_registration where event_id = '$event->id' and payment_id is not null and status not in ('canceled', 'expired', 'failed')"));
}
echo json_encode($result);
$connection->close();