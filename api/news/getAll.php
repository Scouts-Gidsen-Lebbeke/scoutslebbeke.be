<?php
include "../getInternalLogin.php";
$result = new stdClass();
$result->editable = getCurrentUser() != null;
$result->news = mysqli_all_objects($connection, "select n.id, n.title, n.content, n.image, n.date, u.name, u.first_name from news n left join user u on n.user_id = u.id where visible order by date desc");
$connection->close();
echo json_encode($result);
