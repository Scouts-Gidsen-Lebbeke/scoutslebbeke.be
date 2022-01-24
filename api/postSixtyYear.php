<?php
include "connect.php";
function reCaptcha($recaptcha){
    $secret = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/config.ini')['captcha_secret_key'];
    $postvars = array("secret" => $secret, "response" => $recaptcha, "remoteip" => $_SERVER['REMOTE_ADDR']);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postvars);
    $data = curl_exec($ch);
    curl_close($ch);
    return json_decode($data, true);
}
try {
    $firstname = $_POST['firstname'];
    if ($firstname == null) {
        throw new RuntimeException('Geen geldige voornaam!');
    }
    $lastname = $_POST['lastname'];
    if ($lastname == null) {
        throw new RuntimeException('Geen geldige achternaam!');
    }
    $email = $_POST['email'];
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException('Geen geldig e-mailadres!');
    }
    $exists = mysqli_query($connection, "select * from 60_year_contact where email='$email'");
    if (mysqli_num_rows($exists) != 0) {
        throw new RuntimeException('Dit e-mailadres is al opgegeven!');
    }
    $captcha = reCaptcha($_POST['g-recaptcha-response']);
    if (!$captcha['success']) {
        throw new RuntimeException('Geen geldige Captcha!');
    }
    mysqli_query($connection, "insert into 60_year_contact values ('$email', '$firstname', '$lastname')");
    echo json_encode(array("status" => "success", "error" => false, "message" => "Upload succesvol!"));
} catch (RuntimeException $e) {
    echo json_encode(array("status" => "error", "error" => true, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
