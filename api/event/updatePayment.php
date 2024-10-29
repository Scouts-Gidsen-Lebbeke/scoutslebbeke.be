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
        $event_data = mysqli_fetch_object($connection->query("select r.*, e.* from event_registration r left join event e on e.id = r.event_id where r.id = '$order_id'"));
        $eventType = $event_data->eventType === "EVENT" ? "registratie" : "bestelling";
        $additional_data = "";
        if (!empty(json_decode($event_data->additional_data))) {
            $joined = printJsonAsListItems($event_data->additional_data);
            $additional_data = "Hieronder een overzicht van de ontvangen gegevens: $joined";
        }
        $customer = $mollie->customers->get($payment->customerId);
        $amount = $payment->amount->value;
        $mail = createMail();
        $mail->addAddress($customer->email);
        $mail->addCC($config["MAIL_FROM_ADDRESS"]);
        $mail->isHTML();
        $mail->Subject = "Bevestiging $eventType $payment->description";
        $mail->Body = "
            <p>Dag $customer->name,</p>
            <p>
                We hebben de betaling (€ $amount) goed ontvangen, dus hierbij bevestigen we jouw $eventType voor $payment->description.
                $additional_data
                Tot dan!
            </p>
            <p>Stevige linker,<br/>
            De leiding</p>";
        $mail->send();
    }
} catch (ApiException $e) {
    echo "API call failed: " . htmlspecialchars($e->getMessage());
} finally {
    $connection->close();
}

function printJsonAsListItems($jsonString): string {
    $data = json_decode($jsonString, true);
    $result =  "<ul>";
    foreach ($data as $key => $value) {
        if (is_array($value) || is_object($value)) {
            $value = json_encode($value);
        }
        $result .= "<li>" . ucfirst(htmlspecialchars($key)) . ": " . htmlspecialchars($value) . "</li>";
    }
    return $result . "</ul>";
}
