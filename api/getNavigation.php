<?php
include "connect.php";
$result = array();
if ($query = $connection->query("select path, name, `group` from pages where visible order by `index`, subindex")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        if (isset($result[$row["group"]])) {
            array_push($result[$row["group"]], ["name" => $row["name"], "path" => $row["path"]]);
        } else {
            $result[$row["group"]] = [["name" => $row["name"], "path" => $row["path"]]];
        }
    }
}
$query->close();
$connection->close();
echo json_encode($result);
