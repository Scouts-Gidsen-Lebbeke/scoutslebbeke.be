<?php
include "connect.php";
$result = array();
if ($query = $connection->query("select path, p.name, group_name from pages p left join page_groups g on group_name = g.name where visible order by g.index, p.index")) {
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
