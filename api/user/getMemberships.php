<?php
require 'init_membership.php';

$user = getCurrentUser(true);
$active = getActivePeriod();
$result = new stdClass();
$result->history = mysqli_all_objects($connection, "select m.id, m.date, m.price, m.period_id, p.start, p.end, b.name from membership m left join membership_period p on m.period_id = p.id left join branch b on b.id = m.branch_id where m.user_id='$user->id' and m.status = 'paid'");
$filter = array_filter($result->history, fn ($m) => $m->period_id == $active->id);
if (!empty($filter)) {
    $result->active = $filter[0];
}
echo json_encode($result);
$connection->close();