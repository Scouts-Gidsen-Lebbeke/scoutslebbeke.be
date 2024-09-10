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
        $period_id = $payment->metadata->period_id;
        $period = mysqli_fetch_object($connection->query("select * from membership_period where id = '$period_id'"));
        $period_name = date("Y", strtotime($period->start)) . " - " . date("Y", strtotime($period->end));
        $branch_id = $payment->metadata->branch_id;
        $branch = mysqli_fetch_object($connection->query("select * from branch where id = $branch_id"));
        $branch_name = strtolower($branch->name);
        $amount = $payment->amount->value;
        $mail = createMail();
        $mail->addAddress($payment->metadata->email);
        $mail->addCC($branch->email);
        $mail->isHTML();
        $mail->Subject = "Bevestiging inschrijving";
        $mail->Body = "
            <p>Dag $member->first_name,</p>
            <p>
                We hebben de betaling van jouw lidgeld (€ $amount) voor dit werkingsjaar ($period_name)
                bij de $branch_name goed ontvangen, je bent nu volledig ingeschreven!
                Indien je een inschrijvingsbewijs nodig hebt van deze inschrijving, kan je dat steeds terugvinden onder
                <a href='https://www.scoutslebbeke.be/profile/membership.html'>mijn lidmaatschap</a> op onze website.
            </p>
            <p>
                Stevige linker,<br/>
                De leiding
            </p>";
        $mail->send();
    }
} catch (ApiException $e) {
    echo "API call failed: " . htmlspecialchars($e->getMessage());
} finally {
    $connection->close();
}
