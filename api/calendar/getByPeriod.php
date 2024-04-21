<?php
include "../connect.php";
$result = array();
$from = parse(@$_GET['from']);
$to = parse(@$_GET['to']);
if ($from == null && $to == null) {
    $sql = "from `calendar_item`";
} elseif ($from == null) {
    $sql = "from `calendar_item` where toDate < FROM_UNIXTIME('$to')";
} elseif ($to == null) {
    $sql = "from `calendar_item` where fromDate > FROM_UNIXTIME('$from')";
} else {
    $sql = "from `calendar_item` where fromDate > FROM_UNIXTIME('$from') and toDate < FROM_UNIXTIME('$to')";
}
$sql = $sql." and not closed";
$select = "select *";
if (@$_GET["grouped"] == "true") {
    $sql = $sql." group by fromDate, toDate";
    $select = $select.", count(*) as sum";
}
$sql = $select." ".$sql." order by fromDate";
$totalDiff = 0;
$branchCount = mysqli_fetch_column($connection->query("select count(*) from branch where active"));
if ($query = $connection->query($sql)) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        if (key_exists("sum", $row) && $row["sum"] != "1") {
            $groups = intval($row["sum"]);
            $title = "Zondagse werking";
        } else {
            $groups = 1;
            $title = $row["title"];
        }
        if ($row["calendar_period_id"] != null) {
            $groups = $branchCount;
        }
        if (@$_GET["grouped"] == "true") {
            $sql = $sql." group by fromDate, toDate";
            $select = $select.", count(*) as sum";
            $fromDate = new DateTime(date('Y-m-d H:i:s', parse($row["fromDate"])));
            $toDate = new DateTime(date('Y-m-d H:i:s', parse($row["toDate"])));
            $diff = (intval(($toDate->diff($fromDate))->format('%a')) + 1) * $groups;
            $extra = $fromDate != null && $toDate != null ? " => ".$diff." werkingen" : "";
        } else {
            $extra = "";
            $diff = 0;
        }
        $totalDiff += $diff;
        array_push($result, $row["fromDate"]." tot ".$row["toDate"].": ".$title." (".toBranches($groups).")".$extra);
    }
}
$query->close();
$connection->close();
echo join("<br/>", $result);
if ($totalDiff > 0) {
    echo "<br/><b>=> ".$totalDiff." werkingen in totaal = ".($totalDiff/5)." werkingsdagen</b>";
}

function parse($date): int|null {
    if ($date == null) return null;
    if (!strtotime($date)) return null;
    return strtotime($date);
}

function toBranches($count): string {
    return match ($count) {
        1 => "1 groep",
        default => $count . " groepen",
    };
}
