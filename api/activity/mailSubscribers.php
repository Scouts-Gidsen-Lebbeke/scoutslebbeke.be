<?php
require '../getInternalLogin.php';
require '../init_mail.php';

guardStaff();
$result = new stdClass();
$result->succes = array();
$result->error = array();
$id = $_POST['id'];
$registrations = mysqli_all_objects($connection, "select * from activity_registration where activity_id = '$id' and status = 'paid'");
foreach ($registrations as $reg) {
    $member = fetchUserById($reg->user_id);
    try {
        $mail = createMail();
        $mail->addAddress($member->email);
        if ($_POST["cc"]) {
            $mail->addCC($config["MAIL_FROM_ADDRESS"]);
        }
        $mail->isHTML();
        $mail->Subject = $_POST["subject"];
        $mail->Body = $_POST["content"];
        //$mail->addAttachment();
        $mail->send();
        $result->succes[] = $member->email;
    } catch (\PHPMailer\PHPMailer\Exception $e) {
        $feedback = new stdClass();
        $feedback->email = $member->email;
        $feedback->error = $e;
        $result->error[] = $feedback;
    }
}
echo json_encode($result);