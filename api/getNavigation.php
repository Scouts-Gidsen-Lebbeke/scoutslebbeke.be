<?php
require "connect.php";
$groups = mysqli_all_objects($connection, "select * from page_groups order by `rank`");
foreach ($groups as $group) {
    if ($group->name == "Activiteiten") {
        $group->items = array();
        foreach (mysqli_all_objects($connection, "select * from event where now() between open_subscription and end order by start") as $event) {
            $event_page = (object) [
                "name" => $event->name,
                "path" => "activity/" . $event->id,
                "rank" => $event->id,
                "visible" => true,
                "group_id" => $group->id
            ];
            $group->items[] = $event_page;
        }
    } else {
        $group->items = mysqli_all_objects($connection, "select * from pages where group_id='$group->id' and visible order by `rank`");
    }
}
$connection->close();
echo json_encode($groups);
