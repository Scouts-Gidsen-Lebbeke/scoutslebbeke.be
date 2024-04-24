<?php
require '../getInternalLogin.php';
require '../uploads.php';

$user = getUser(true);
$result = upload($_FILES['upfile'], "profile");
if ($result->succes) {
    $result->succes = mysqli_query($connection, "update user set image = '$result->name' where id='$user->id'");
}
echo json_encode($result);
