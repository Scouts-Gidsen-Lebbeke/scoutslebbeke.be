<?php
include "connect.php";
$visiblePeriod = '';
if ($query = $connection->query("select setting_value from settings where setting_id='current-calendar-period'")) {
    $visiblePeriod = mysqli_fetch_assoc($query)['setting_value'];
}
$result = array();
if ($query = $connection->query("select * from calendar_item i inner join calendar c on c.id = i.calendar_id where c.period_id = '$visiblePeriod' order by c.branch_id, i.fromDate")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        if (!array_key_exists($row['branch_id'], $result)) {
            $result[$row['branch_id']] = array();
        }
        array_push($result[$row['branch_id']], $row);
    }
}
$query->close();
$connection->close();
echo json_encode($result);
