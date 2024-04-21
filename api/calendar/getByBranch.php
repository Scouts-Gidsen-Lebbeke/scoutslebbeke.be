<?php
require "../getInternalLogin.php";
$branch = $_GET['branch'];
$user = getUser();
$admin = $user != null && $user->level->isAdmin();
$staff_of_branch = $user != null && $user->level->isStaff() && $user->staff_branch == $branch;
$calendar = null;
$period_id = @$_GET['period'];
$period = null;
if ($period_id == null) {
    $period = mysqli_fetch_object($connection->query("select * from calendar_period where now() between start and end"))->id;
} else {
    $period = mysqli_fetch_object($connection->query("select * from calendar_period where id = '$period_id'"));
}
if ($period != null) {
    $calendar = mysqli_fetch_object($connection->query("select * from calendar where branch_id = '$branch' and period_id = '$period->id'"));
    if ($calendar != null) {
        $calendar->period = $period;
        $calendar->editable = $admin || $staff_of_branch;
        $calendar->items = mysqli_all_objects($connection, "select * from calendar_item where calendar_id = '$calendar->id' or calendar_period_id = '$period->id' order by fromDate");
        foreach ($calendar->items as $item) {
            if ($item->location_id != null) {
                $item->location = mysqli_fetch_object($connection->query("select * from location where id='$item->location_id'"));
            }
            $item->editable = $admin || ($item->calendar_id != null && $staff_of_branch);
        }
        if ($calendar->editable) {
            foreach (find_sundays($period->start, $period->end) as $i => $sunday) {
                $before = items_before($calendar, date_time_set($sunday, 23, 59));
                if ($before < $i + 1) {
                    $calendar->items[] = create_default_item($calendar->id, $sunday);
                }
            }
            usort($calendar->items, fn($f, $s) => strtotime($s->fromDate) < strtotime($f->fromDate));
        }
    }
}
$connection->close();
echo json_encode($calendar);

function items_before($calendar, $date): int {
    return sizeof(array_filter($calendar->items, fn($i) => $i->fromDate < $date));
}

function find_sundays($begin, $end): array {
    $result = array();
    $from = DateTime::createFromFormat('Y-m-d', $begin);
    $to = DateTime::createFromFormat('Y-m-d', $end);
    while ($from <= $to) {
        if($from->format("D") == "Sun") {
            $result[] = clone $from;
            $from->modify('+1 week');
        } else {
            $from->modify('+1 day');
        }
    }
    return $result;
}

function create_default_item($id, $sunday): stdClass {
    $item = new stdClass();
    $item->calendar_id = $id;
    $item->title = "Nog in te vullen";
    $item->fromDate = date_time_set($sunday, 14, 00)->format('Y-m-d H:i:s');
    $item->toDate = date_time_set($sunday, 17, 00)->format('Y-m-d H:i:s');
    $item->content = "Nog in te vullen";
    $item->editable = true;
    return $item;
}
