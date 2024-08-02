<?php
include 'init_membership.php';

$result = new stdClass();
try {
    guardStaff();
    $period = getActivePeriod();
    $result->period = $period;
    $branch_id = $_GET['branch'];
    $memberships = mysqli_all_objects($connection, "select m.* from membership m left join user u on m.user_id = u.id where m.period_id = '$period->id' and m.branch_id = '$branch_id' and status = 'paid'");
    $result->members = array();
    foreach ($memberships as $m) {
        $member = fetchUserById($m->user_id);
        $member->membership_date = $m->date;
        $result->members[] = $member;
    }
} catch (Exception $e) {
    $result->error =$e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);
