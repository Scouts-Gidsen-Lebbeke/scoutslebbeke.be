<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$myArray = array();
$path = $_GET['q'];
if ($result = $connection->query("select * from pages where path='$path'")) {
    if (mysqli_num_rows($result) == 1) {
        echo json_encode(array("success" => true, "data" => $result->fetch_array(MYSQLI_ASSOC)));
    } else {
        echo json_encode(array("success" => false));
    }
}
$result->close();
$connection->close();
