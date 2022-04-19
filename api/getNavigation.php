<?php
include "connect.php";
$result = array();
if ($query = $connection->query("select path, p.name, g.name as group_name from pages p left join page_groups g on p.group_id = g.id where visible order by g.rank, p.rank")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        if (isset($result[$row["group_name"]])) {
            array_push($result[$row["group_name"]], ["name" => $row["name"], "path" => $row["path"]]);
        } else {
            $result[$row["group_name"]] = [["name" => $row["name"], "path" => $row["path"]]];
        }
    }
}
$query->close();
$connection->close();
echo json_encode($result);
