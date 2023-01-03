<?php
include "connect.php";
$visiblePeriod = '';
if ($query = $connection->query("select setting_value from settings where setting_id='current-calendar-period'")) {
    $visiblePeriod = mysqli_fetch_assoc($query)['setting_value'];
}
$result = array();
if ($query = $connection->query("select * from `calendar-item` where period = '$visiblePeriod' order by `group`, fromDate")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        if (!array_key_exists($row['group'], $result)) {
            $result[$row['group']] = array();
        }
        array_push($result[$row['group']], $row);
    }
}
$query->close();
$connection->close();
echo json_encode($result);
