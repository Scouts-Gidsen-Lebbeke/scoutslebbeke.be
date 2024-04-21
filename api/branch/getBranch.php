<?php
require "../connect.php";
$branch_id = $_GET['id'];
$branch = mysqli_fetch_object($connection->query("select * from branch where id='$branch_id'"));
$branch->staff = mysqli_all_objects($connection, "select u.id, u.name, u.first_name, u.mobile, u.image, s.Totem, s.kapoenenbijnaam, s.welpenbijnaam, (select count(*) from user_role r where r.user_id = id and r.role_id = 9) as branchHead from user_role r left join user u on r.user_id = u.id left join staff s on s.user_id = u.id where r.role_id = '$branch->staff_role_id' order by branchHead desc");
$connection->close();
echo json_encode($branch);