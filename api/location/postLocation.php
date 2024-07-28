<?php
require "../getInternalLogin.php";
$user = guardStaff();
$result = new stdClass();
try {
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    if (empty($name)) {
        throw new InvalidArgumentException("Een naam is verplicht!");
    }
    $address = mysqli_real_escape_string($connection, $_POST['address']);
    if (empty($address)) {
        throw new InvalidArgumentException("Een adres is verplicht!");
    }
    $url = mysqli_real_escape_string($connection, $_POST['url']);
    $result->succes = mysqli_query($connection, "insert into location values (null, '$name', '$address', '$url')");
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);