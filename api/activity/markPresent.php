<?php
include '../getInternalLogin.php';

$user = guardStaff();
$result = new stdClass();
try {
    $present = $_GET['present'] == 'true';
    $member_id = $_GET['memberId'];
    //$member = getUserById($member_id);
    $activity_id = $_GET['activityId'];
    $activity = mysqli_fetch_object($connection->query("select * from activity where id='$activity_id'"));
    if ((strtotime($activity->start) > time() || strtotime($activity->end) < time()) && !$user->level->isAdmin()) {
        throw new InvalidArgumentException("Een lid kan alleen als aanwezig worden geregistreerd tijdens de activiteit!");
    }
    $result->success = mysqli_query($connection, "update activity_registration set present = '$present' where user_id = '$member_id' and activity_id = '$activity_id'");
} catch (Exception $e) {
    $result->error = $e->getMessage();
}
echo json_encode($result);
