<?php
include '../getInternalLogin.php';

$user = guardStaff();
$result = new stdClass();
try {
    $present = $_GET['present'] == 'true';
    $registration_id = $_GET['id'];
    //$member = getUserById($member_id);
    $activity_id = $_GET['activityId'];
    $activity = mysqli_fetch_object($connection->query("select * from activity where id='$activity_id'"));
    if ((strtotime($activity->start) > time() || strtotime($activity->end) < time()) && !$user->level->isAdmin()) {
        throw new InvalidArgumentException("Een lid kan alleen als aanwezig worden geregistreerd tijdens de activiteit!");
    }
    $result->success = mysqli_query($connection, "update activity_registration set present = '$present' where id = '$registration_id'");
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);