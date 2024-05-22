<?php
use Mollie\Api\Exceptions\ApiException;

require "../init_mollie.php";
require "../connect.php";
require '../init_mail.php';

try {
    $payment = $mollie->payments->get($_POST["id"]);
    $order_id = $payment->metadata->order_id;
    // https://docs.mollie.com/payments/status-changes
    $connection->query("update event_registration set status = '$payment->status' where id = '$order_id'");
    if ($payment->isPaid() && !$payment->hasRefunds() && !$payment->hasChargebacks()) {
        $registration = mysqli_fetch_object($connection->query("select * from event_registration where id = '$order_id'"));
        $mail->addAddress($registration->email);
        $mail->addCC($config["MAIL_FROM_ADDRESS"]);
        $mail->isHTML();
        $mail->Subject = "Bevestiging registratie $payment->description";
        $mail->Body = "<p>Dag $registration->first_name,</p><p>We hebben de betaling goed ontvangen, dus hierbij bevestigen we jouw registratie voor $payment->description. Tot dan!</p><p>Stevige linker,<br/>De leiding</p>";
        $mail->AltBody = "Dag $registration->first_name, we hebben de betaling goed ontvangen, dus hierbij bevestigen we jouw registratie voor $payment->description. Tot dan! Stevige linker, de leiding";
        $mail->send();
    }
} catch (ApiException $e) {
    echo "API call failed: " . htmlspecialchars($e->getMessage());
} finally {
    $connection->close();
}
