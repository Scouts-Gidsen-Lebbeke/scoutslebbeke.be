<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$myArray = array();
if ($result = $connection->query("select * from page_groups")) {
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $myArray[] = $row;
    }
    echo json_encode(array("success" => true, "list" => $myArray));
} else {
    echo json_encode(array("success" => false));
}
$result->close();
$connection->close();
