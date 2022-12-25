<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$username = $_GET['q'];
if ($query = $connection->query("select * from staff where username='$username'")) {
    if (mysqli_num_rows($query) == 1) {
        echo json_encode(array("success" => true, "data" => $query->fetch_array(MYSQLI_ASSOC)));
    } else {
        echo json_encode(array("success" => false));
    }
}
$query->close();
$connection->close();