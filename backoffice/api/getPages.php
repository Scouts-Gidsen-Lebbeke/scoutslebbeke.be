<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$myArray = array();
if ($result = $connection->query("select p.path, p.name, g.name as group_name, p.rank, g.rank as group_rank as group_index, p.visible from pages p left join page_groups g on p.group_id = g.id")) {
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        array_push($myArray, $row);
    }
    echo json_encode(array("success" => true, "list" => $myArray));
} else {
    echo json_encode(array("success" => false));
}
$result->close();
$connection->close();