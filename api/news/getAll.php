<?php
include "../getInternalLogin.php";
$result = mysqli_all_objects($connection, "select n.id, n.title, n.content, n.image, n.date as createdDate from news n where visible order by date desc");
$connection->close();
echo json_encode($result);
