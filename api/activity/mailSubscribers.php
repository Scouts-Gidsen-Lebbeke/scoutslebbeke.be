<?php
require '../getInternalLogin.php';
require '../init_mail.php';

guardStaff();
$id = $_POST['id'];
$registrations = mysqli_all_objects($connection, "select * from activity_registration where activity_id = '$id' and status = 'paid'");
$recipients = array();
foreach ($registrations as $reg) {
    $member = fetchUserById($reg->user_id);
    $recipients[] = $member->email;
}
echo json_encode(sendMail($recipients));