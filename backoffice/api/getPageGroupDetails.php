<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$myArray = array();
$id = $_GET['q'];
if ($result = $connection->query("select * from page_groups where id='$id'")) {
    if (mysqli_num_rows($result) == 1) {
        echo json_encode(array("success" => true, "data" => $result->fetch_array(MYSQLI_ASSOC)));
    } else {
        echo json_encode(array("success" => false));
    }
}
$result->close();
$connection->close();
