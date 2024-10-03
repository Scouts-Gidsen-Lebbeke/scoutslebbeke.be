<?php
require "../connect.php";
$branch_id = $_GET['id'];
$branch = mysqli_fetch_object($connection->query("select * from branch where id='$branch_id'"));
$branch->staff = mysqli_all_objects($connection, "select u.id, u.name, u.first_name, s.mobile, u.image, s.Totem, s.kapoenenbijnaam, s.welpenbijnaam, sb.branch_head from staff s left join staff_branch sb on s.user_id = sb.user_id left join user u on s.user_id = u.id where sb.branch_id = '$branch_id' order by sb.branch_head desc");
$connection->close();
echo json_encode($branch);