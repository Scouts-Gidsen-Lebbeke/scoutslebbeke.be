<?php
include "connect.php";
$result = array();
$from = parse(@$_GET['from']);
$to = parse(@$_GET['to']);
if ($from == null && $to == null) {
    $sql = "select * from `calendar-item` order by fromDate";
} elseif ($from == null) {
    $sql = "select * from `calendar-item` where `toDate` < FROM_UNIXTIME('$to') order by fromDate";
} elseif ($to == null) {
    $sql = "select * from `calendar-item` where `fromDate` > FROM_UNIXTIME('$from') order by fromDate";
} else {
    $sql = "select * from `calendar-item` where `fromDate` > FROM_UNIXTIME('$from') and `toDate` < FROM_UNIXTIME('$to') order by fromDate";
}
if ($query = $connection->query($sql)) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        array_push($result, $row["fromDate"]." tot ".$row["toDate"].": ".$row["title"]." (".toBranch($row["group"]).")");
    }
}
$query->close();
$connection->close();
echo join("<br>", $result);

function parse($date): int|null {
    if ($date == null) return null;
    if (!strtotime($date)) return null;
    return strtotime($date);
}

function toBranch($branch): string {
    return match (intval($branch)) {
        1 => "Kapoenen",
        2 => "Welpen",
        3 => "Pioniers",
        4 => "Jonggivers",
        5 => "Givers",
        6 => "Jins",
        default => "Onbepaald",
    };
}
