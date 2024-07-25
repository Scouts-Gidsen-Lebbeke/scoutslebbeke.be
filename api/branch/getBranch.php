<?php
require "../connect.php";
$branch_id = $_GET['id'];
$branch = mysqli_fetch_object($connection->query("select * from branch where id='$branch_id'"));
$branch->staff = mysqli_all_objects($connection, "select u.id, u.name, u.first_name, u.mobile, u.image, s.Totem, s.kapoenenbijnaam, s.welpenbijnaam, s.branch_head from staff s left join user u on s.user_id = u.id where s.branch_id = '$branch_id' order by branch_head desc");
$connection->close();
echo json_encode($branch);