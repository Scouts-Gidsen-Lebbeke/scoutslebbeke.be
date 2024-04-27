<?php
require "../getInternalLogin.php";
guardStaff();
$id = $_GET['id'];
$succes = mysqli_query($connection, "insert into calendar_item values (null, now(), now(), 'Titel', 'Inhoud', null, null, '$id', 0, null, null)");
if ($succes) {
    echo json_encode($connection->insert_id);
} else {
    echo json_encode($succes);
}
$connection->close();
