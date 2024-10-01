<?php
require '../getInternalLogin.php';

guardStaff();
$external_id = $_GET["memberId"];
$active = getActivePeriod();
$result = mysqli_fetch_object($connection->query("select m.* from membership m left join user u on m.user_id = u.id where u.sgl_id='$external_id' and m.status = 'paid' and m.period_id = '$active->id'"));
echo json_encode($result);
$connection->close();