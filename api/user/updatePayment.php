<?php
use Mollie\Api\Exceptions\ApiException;

require "../init_mollie.php";
require "../connect.php";
require '../init_mail.php';

try {
    $payment = $mollie->payments->get($_POST["id"]);
    $membership_id = $payment->metadata->membership_id;
    // https://docs.mollie.com/payments/status-changes
    $connection->query("update membership set status = '$payment->status' where id = '$membership_id'");
    if ($payment->isPaid() && !$payment->hasRefunds() && !$payment->hasChargebacks()) {
        $member_id = $payment->metadata->member_id;
        $member = mysqli_fetch_object($connection->query("select * from user where id = '$member_id'"));
        $mail->addAddress($member->email);
        $mail->addCC($config["MAIL_FROM_ADDRESS"]);
        $mail->isHTML();
        $mail->Subject = "Bevestiging inschrijving";
        $mail->Body = "<p>Dag $member->first_name,</p><p>We hebben de betaling van jouw lidgeld voor dit werkingsjaar goed ontvangen, je bent nu volledig ingeschreven!</p><p>Stevige linker,<br/>De leiding</p>";
        $mail->AltBody = "Dag $member->first_name, we hebben de betaling van jouw lidgeld voor dit werkingsjaar goed ontvangen, je bent nu volledig ingeschreven! Stevige linker, de leiding";
        $mail->send();
    }
} catch (ApiException $e) {
    echo "API call failed: " . htmlspecialchars($e->getMessage());
} finally {
    $connection->close();
}
