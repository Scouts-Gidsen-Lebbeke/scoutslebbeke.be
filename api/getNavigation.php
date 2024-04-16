<?php
require "connect.php";
$groups = mysqli_all_objects($connection, "select * from page_groups order by `rank`");
foreach ($groups as $group) {
    if ($group->name == "Activiteiten") {
        $group->items = array();
        foreach (mysqli_all_objects($connection, "select * from activity where now() < end order by start") as $activity) {
            $activity_page = (object) [
                "name" => $activity->name,
                "path" => "activity.html?id=" . $activity->id,
                "rank" => $activity->start,
                "visible" => true,
                "group_id" => $group->id
            ];
            $group->items[] = $activity_page;
        }
    } else if ($group->name == "Takken") {
        $group->items = array();
        foreach (mysqli_all_objects($connection, "select * from branch where active order by minimum_age") as $branch) {
            $branch_page = (object) [
                "name" => $branch->name,
                "path" => "branch.html?id=" . $branch->id,
                "rank" => $branch->minimum_age,
                "visible" => true,
                "group_id" => $group->id
            ];
            $group->items[] = $branch_page;
        }
    } else {
        $group->items = mysqli_all_objects($connection, "select * from pages where group_id='$group->id' and visible order by `rank`");
    }
}
$connection->close();
echo json_encode($groups);
