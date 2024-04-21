<?php
require "../getInternalLogin.php";
$result = new stdClass();
try {
    getUser(true);
    $id = $_POST['id'];
    if (empty($id)) {
        throw new InvalidArgumentException("Er liep iets mis bij het ophalen van de kalender!");
    }
    $intro = $_POST['intro'];
    $result->succes = mysqli_query($connection, "update calendar set intro = '$intro' where id='$id'");
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);