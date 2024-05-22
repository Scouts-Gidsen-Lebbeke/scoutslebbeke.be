<?php
require '../getInternalLogin.php';

guardStaff();
$id = $_GET["id"];
$branch = $_GET["branch"];
if ($branch == "0") {
    $query = "select * from subscription_overview where id = '$id' order by branch_id";
} else {
    $query = "select * from subscription_overview where id = '$id' and branch_id = '$branch'";
}
echo json_encode(mysqli_all_objects($connection, $query));
$connection->close();
