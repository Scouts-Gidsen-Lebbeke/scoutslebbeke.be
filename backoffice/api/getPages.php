<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$myArray = array();
if ($result = $connection->query("select path, name from pages")) {
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        array_push($myArray, array("path" => $row["path"], "name" => $row["name"]));
    }
    echo json_encode(array("success" => true, "list" => $myArray));
} else {
    echo json_encode(array("success" => false));
}
$result->close();
$connection->close();