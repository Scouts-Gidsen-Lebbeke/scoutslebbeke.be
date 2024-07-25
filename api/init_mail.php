<?php
//Import PHPMailer classes into the global namespace
//These must be at the top of your script, not inside a function
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

//Load Composer's autoloader
require_once 'init_env.php';
require_once __DIR__ . "/../vendor/autoload.php";

//Create an instance; passing `true` enables exceptions
function createMail(): PHPMailer {
    global $config;
    $mail = new PHPMailer(true);
    $mail->SMTPDebug = filter_var($config["APP_DEBUG"], FILTER_VALIDATE_BOOLEAN) ? SMTP::DEBUG_SERVER : SMTP::DEBUG_OFF;
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