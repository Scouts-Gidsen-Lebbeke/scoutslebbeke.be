<?php
require '../connect.php';

$id = $_GET["id"];
$result = mysqli_fetch_object($connection->query("select m.*, p.start, p.end, b.name from membership m left join membership_period p on m.period_id = p.id left join branch b on b.id = m.branch_id where m.id = '$id'"));
$result->user = mysqli_fetch_object($connection->query("select * from user where id = $result->user_id"));
echo json_encode($result);
$connection->close();