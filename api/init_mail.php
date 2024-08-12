<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require_once 'init_env.php';
require_once __DIR__ . "/../vendor/autoload.php";

function createMail(): PHPMailer {
    global $config, $debug;
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = $debug ? SMTP::DEBUG_SERVER : SMTP::DEBUG_OFF;
    $mail->isSMTP();
    $mail->SMTPDebug = false;
    $mail->Host = $config["MAIL_HOST"];
    $mail->SMTPAuth = true;
    $mail->Username = $config["MAIL_USERNAME"];
    $mail->Password = $config["MAIL_PASSWORD"];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config["MAIL_PORT"];
    $mail->setFrom($config["MAIL_FROM_ADDRESS"], $config["MAIL_FROM_NAME"]);
    $mail->addReplyTo($config["MAIL_FROM_ADDRESS"], $config["MAIL_FROM_NAME"]);
    return $mail;
}

function sendMail($recipients): stdClass {
    global $config, $debug;
    $result = new stdClass();
    $attachments = $_FILES['attachments'];
    try {
        $mail = createMail();
        if (!$debug) {
            if ($_POST["cc"]) {
                $mail->addCC($config["MAIL_FROM_ADDRESS"]);
            }
            foreach ($recipients as $r) {
                $mail->addBCC($r);
            }
        } else {
            $mail->addAddress($config["MAIL_FROM_ADDRESS"]);
        }
        $mail->isHTML();
        if (empty($_POST["subject"])) {
            throw new InvalidArgumentException("Het onderwerp mag niet leeg zijn!");
        }
        $mail->Subject = $_POST["subject"];
        if (empty($_POST["content"])) {
            throw new InvalidArgumentException("De inhoud mag niet leeg zijn!");
        }
        $mail->Body = $_POST["content"];
        if (!empty($attachments['name'][0])) {
            for ($i = 0; $i < count($attachments['name']); $i++) {
                if (is_uploaded_file($attachments['tmp_name'][$i])) {
                    $mail->addAttachment($attachments['tmp_name'][$i], $attachments['name'][$i]);
                }
            }
        }
        $mail->send();
        $result->success = true;
        $result->amount = count($recipients);
    } catch (Exception $e) {
        $result->error = $e->getMessage();
    }
    return $result;
}