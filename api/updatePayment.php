<?php
use Mollie\Api\Exceptions\ApiException;

require "init_mollie.php";
require "connect.php";
require 'init_mail.php';

try {
    $payment = $mollie->payments->get($_POST["id"]);
    $order_id = $payment->metadata->order_id;
    // https://docs.mollie.com/payments/status-changes
    $connection->query("update event_registration set status = '$payment->status' where id = '$order_id'");
    if ($payment->isPaid() && !$payment->hasRefunds() && !$payment->hasChargebacks()) {
        $user_id = $payment->metadata->user_id;
        $user = mysqli_fetch_object($connection->query("select * from user where id = '$user_id'"));
        $mail->addAddress($user->email);
        $mail->addCC($config["MAIL_FROM_ADDRESS"]);
        $mail->isHTML();
        $mail->Subject = "Inschrijvingsbevestiging $payment->description";
        $mail->Body = "<p>Dag $user->first_name,</p><p>We hebben de betaling goed ontvangen, dus hierbij bevestigen we jouw inschrijving voor $payment->description. Tot dan!</p><p>Stevige linker,<br/>De leiding</p>";
        $mail->AltBody = "Dag $user->first_name, we hebben de betaling goed ontvangen, dus hierbij bevestigen we jouw inschrijving voor $payment->description. Tot dan! Stevige linker, de leiding";
        $mail->send();
    }
} catch (ApiException $e) {
    echo "API call failed: " . htmlspecialchars($e->getMessage());
}
