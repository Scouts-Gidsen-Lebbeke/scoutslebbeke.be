<?php
include "connect.php";
$visiblePeriod = '';
if ($query = $connection->query("select setting_value from settings where setting_id='current-calendar-period'")) {
    $visiblePeriod = mysqli_fetch_assoc($query)['setting_value'];
}
$branches = array();
if ($query = $connection->query("select id from branch")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        $branches[] = $row['id'];
    }
}
$result = array();
if ($query = $connection->query("select i.id, c.branch_id, '$visiblePeriod' as period, i.fromDate, i.toDate, i.title, i.content, i.image from calendar_item i left join calendar c on c.id = i.calendar_id where c.period_id = '$visiblePeriod' or i.calendar_period_id = '$visiblePeriod' order by i.fromDate")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        $branch = $row['branch_id'];
        if ($branch == null) {
            foreach ($branches as $b) {
                $result[$b][] = $row;
            }
            continue;
        }
        if (!array_key_exists($branch, $result)) {
            $result[$row['branch_id']] = array();
        }
        $result[$branch][] = $row;
    }
}
$query->close();
$connection->close();
echo json_encode($result);
