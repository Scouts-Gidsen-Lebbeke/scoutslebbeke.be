<?php
require "../connect.php";

echo json_encode(mysqli_all_objects($connection, "select id, name from activity"));