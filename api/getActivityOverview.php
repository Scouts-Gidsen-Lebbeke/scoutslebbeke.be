<?php
require 'getInternalLogin.php';

$user = getUser(true);
if (!$user->level->isStaff()) {
    header("HTTP/1.1 401 Unauthorized");
    exit;
}
$id = $_GET["id"];
$subscriptions = mysqli_all_objects($connection, "select * from subscription_overview where id='$id' order by branch_id");
$connection->close();
echo json_encode($subscriptions);
