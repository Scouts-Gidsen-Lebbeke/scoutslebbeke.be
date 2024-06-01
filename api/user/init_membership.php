<?php
include '../getInternalLogin.php';

function getActivePeriod() {
    global $connection;
    $active = mysqli_fetch_object($connection->query("select * from membership_period where now() between start and end"));
    if (empty($active)) {
        $last = mysqli_fetch_object($connection->query("select * from membership_period order by start limit 1"));
        if (empty($last)) {
            throw new RuntimeException("You forgot to configure a first period dumbass!");
        }
        $new_start = strtotime("$last->end+1 day");
        $new_end = date("Y-m-d", $new_start + strtotime($last->end) - strtotime($last->start));
        $new_start = date("Y-m-d", $new_start);
        $connection->query("insert into membership_period values (null, '$new_start', '$new_end', '$last->price')");
        return mysqli_fetch_object($connection->query("select * from membership_period where id = '$connection->insert_id'"));
    }
    return $active;
}
