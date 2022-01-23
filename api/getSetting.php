<?php
include "connect.php";
$setting_id = $_GET['q'];
if ($query = $connection->query("select setting_value from settings where setting_id='$setting_id'")) {
    echo json_encode(array("setting_value" => mysqli_fetch_assoc($query)['setting_value']));
}
$query->close();
$connection->close();

