<?php
require "../getInternalLogin.php";

$user = guardStaff();
$result = new stdClass();
try {
    $address = mysqli_real_escape_string($connection, $_POST['place_id']);
    if (empty($address)) {
        throw new InvalidArgumentException("Geen adres opgegeven!");
    }
    $address = translatePlace($address);
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    $name = empty($name) ? $address->name : $name;
    $name = !empty($name) ? "'$name'" : "NULL";
    $url = mysqli_real_escape_string($connection, $_POST['url']);
    $url = empty($url) ? $address->url : $url;
    $url = !empty($url) ? "'$url'" : "NULL";
    $result->succes = mysqli_query($connection, "insert into location values (null, $name, '$address->street', '$address->number', '$address->addition', '$address->zip', '$address->town', '$address->country', $url)");
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);
