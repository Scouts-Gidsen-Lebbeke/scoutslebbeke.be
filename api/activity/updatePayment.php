<?php
use Mollie\Api\Exceptions\ApiException;

require "../init_mollie.php";
require "../connect.php";
require '../init_mail.php';

try {
    $payment = $mollie->payments->get($_POST["id"]);
    $order_id = $payment->metadata->order_id;
    // https://docs.mollie.com/payments/status-changes
    $connection->query("update activity_registration set status = '$payment->status' where id = '$order_id'");
    if ($payment->isPaid() && !$payment->hasRefunds() && !$payment->hasChargebacks()) {
        $customer = $mollie->customers->get($payment->customerId);
        $amount = $payment->amount->value;
        $mail = createMail();
        $mail->addAddress($customer->email);
        $mail->addCC($config["MAIL_FROM_ADDRESS"]);
        $mail->isHTML();
        $mail->Subject = "Inschrijvingsbevestiging $payment->description";
        $mail->Body = "
            <p>Dag $customer->name,</p>
            <p>
                We hebben de betaling (€ $amount) goed ontvangen, dus hierbij bevestigen we jouw inschrijving voor $payment->description. 
                Tot dan!
            </p>
            <p>Stevige linker,<br/>
            De leiding</p>
            ";
        // TODO: add metadata to confirmation email
        $mail->send();
    } else if ($payment->hasRefunds()) {
        $connection->query("update activity_registration set status = 'canceled' where id = '$order_id'");
        $customer = $mollie->customers->get($payment->customerId);
        $amount = $payment->getAmountRefunded();
        $mail = createMail();
        $mail->addAddress($customer->email);
        $mail->addCC($config["MAIL_FROM_ADDRESS"]);
        $mail->isHTML();
        $mail->Subject = "Bevestiging annulatie $payment->description";
        $mail->Body = "
            <p>Dag $customer->name,</p>
            <p>
                Jouw inschrijving voor $payment->description werd succesvol geannuleerd, 
                je ontvangt binnenkort het betaalde bedrag exclusief administratiekosten (€ $amount).
            </p>
            <p>Stevige linker,<br/>
            De leiding</p>
        ";
        $mail->send();
    }
} catch (ApiException $e) {
    echo "API call failed: " . htmlspecialchars($e->getMessage());
} finally {
    $connection->close();
}
