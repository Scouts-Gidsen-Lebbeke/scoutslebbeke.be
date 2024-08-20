<?php
require '../getInternalLogin.php';
require '../init_mail.php';

guardStaff();
$id = $_POST['id'];
$recipients = mysqli_all_columns($connection, "select email from event_registration where event_id = '$id' and status = 'paid'");
echo json_encode(sendMail($recipients));