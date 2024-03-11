<?php
require 'init_subscription.php';
require 'init_mollie.php';

$result = new stdClass();
try {
    $user = getUser(true, true);
    $state = getSubscriptionState($user);
    if ($state->error ?? false) {
        throw new InvalidArgumentException($state->error);
    } else if ($state->registration ?? false) {
        throw new InvalidArgumentException("Je bent reeds ingeschreven voor deze activiteit!");
    } else if ($state->open_subscription ?? false) {
        throw new InvalidArgumentException("De inschrijvingen voor deze activiteit zijn nog niet geopend!");
    }
    $activity = $state->activity;
    $activity_restriction_id = $_GET['option'];
    if ($activity_restriction_id == null) {
        throw new InvalidArgumentException("Je hebt geen geldige optie opgegeven bij de inschrijving!");
    }
    $options = $state->options;
    $chosen_option = array_values(array_filter($options, fn($o) => $o->id == $activity_restriction_id));
    if (empty($chosen_option)) {
        throw new InvalidArgumentException("Je hebt geen geldige optie opgegeven bij de inschrijving!");
    }
    $connection->query("insert into event_registration values (null, '$activity->id', '$user->id', now(), 'open', null)");
    $order_id = $connection->insert_id;
    $payment = $mollie->payments->create([
        "amount" => [
            "currency" => "EUR",
            "value" => double($chosen_option[0]->price)
        ],
        "description" => $activity->name,
        "redirectUrl" => $config["SERVER_URL"] . "/activity.html?id=" . $activity->id . "&payment_return=true",
        "webhookUrl" => $config["NGROK_URL"] . "/api/updatePayment.php",
        "metadata" => [
            "order_id" => $order_id,
            "user_id" => $user->id
        ]
    ]);
    $connection->query("update event_registration set payment_id = '$payment->id' where id = '$order_id'");
    $result->checkout = $payment->getCheckoutUrl();
} catch (Exception $e) {
    $result->error = $e;
}
echo json_encode($result);

function double($d): string {
    return number_format($d, 2, '.', '');
}

