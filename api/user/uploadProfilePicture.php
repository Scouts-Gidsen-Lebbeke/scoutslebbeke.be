<?php
require '../getInternalLogin.php';
require '../uploads.php';

$user = getCurrentUser(true);
$result = upload($_FILES['upfile'], "profile");
if ($result->succes) {
    $result->succes = mysqli_query($connection, "update user set image = '$result->name' where id='$user->id'");
    delete("profile", $user->image);
}
echo json_encode($result);
