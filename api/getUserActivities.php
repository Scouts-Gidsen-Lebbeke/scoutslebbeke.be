<?php
require "connect.php";

$user_id=$_GET["id"];
echo json_encode(mysqli_all_objects($connection, "select r.id, e.name, r.date, r.status from event_registration r left join event e on e.id = r.event_id where r.user_id='$user_id'"));