<?php
require '../getInternalLogin.php';

guardStaff();
$id = $_GET["id"];
$result = new stdClass();
$result->activity = mysqli_fetch_object($connection->query("select * from activity where id = '$id'"));
$result->registrations = mysqli_all_objects($connection, $query = "select * from activity_registration where activity_id = '$id' and status = 'paid'");
foreach ($result->registrations as $r) {
    $r->user = fetchUserById($r->user_id, $r->date);
}
echo json_encode($result);
$connection->close();
