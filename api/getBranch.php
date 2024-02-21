<?php
require "connect.php";
$branch_id = $_GET['id'];
$branch = mysqli_fetch_object($connection->query("select * from branch where id='$branch_id'"));
$branch->staff = mysqli_all_objects($connection, "select * from staff left join user on staff.user_id = user.id where event_id='$branch_id'");
$connection->close();
echo json_encode($branch);