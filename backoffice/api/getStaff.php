<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$myArray = array();
if ($result = $connection->query("select username, Voornaam, Achternaam from profiel")) {
    while ($row = $result->fetch_assoc()) {
        array_push($myArray, $row);
    }
    echo json_encode(array("success" => true, "list" => $myArray));
} else {
    echo json_encode(array("success" => false));
}
$result->close();
$connection->close();