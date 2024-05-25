<?php
require 'init_subscription.php';
require '../init_mollie.php';

$result = new stdClass();
try {
    if (!empty($_POST['memberId'])) {
        $user = guardStaff();
        $member = getUserById($_POST['memberId']);
        unset($_POST['memberId']);
    } else {
        $user = getUser();
        $member = $user;
    }
    $as_staff = $member->id != $user->id;
    $state = getSubscriptionState($member, $user);
    if ($state->error ?? false) {
        throw new InvalidArgumentException($state->error);
    } else if ($state->registration ?? false) {
        if ($as_staff) {
            $result->registration->feedback = $member->first_name." is reeds ingeschreven voor deze activiteit.";
        } else {
            $result->registration->feedback = "Je bent reeds ingeschreven voor deze activiteit.";
        }
    } else if ($state->open_subscription ?? false) {
        throw new InvalidArgumentException("De inschrijvingen voor deze activiteit zijn nog niet geopend!");
    }
    $activity = $state->activity;
    $activity_restriction_id = $_POST['option'];
    if ($activity_restriction_id == null) {
        throw new InvalidArgumentException("Er werd geen geldige optie opgegeven bij de inschrijving!");
    }
    unset($_POST['option']);
    $options = $state->options;
    $chosen_option = array_values(array_filter($options, fn($o) => $o->id == $activity_restriction_id));
    if (empty($chosen_option)) {
        throw new InvalidArgumentException("Er werd geen geldige optie opgegeven bij de inschrijving!");
    }
    $price = double($_POST['price']);
    if ($price < double($chosen_option[0]->price)) {
        throw new InvalidArgumentException("De inschrijvingsprijs kan niet lager zijn dan de basisprijs van de gekozen optie!");
    }
    unset($_POST['price']);
    $data = json_encode($_POST);
    if ($as_staff) {
        $redirect = "/activity/staffSubscription.html?id=".$activity->id."&memberId=".$member->sgl_id."&payment_return=true";
    } else {
        $redirect = "/activity.html?id=".$activity->id."&payment_return=true";
    }
    $connection->query("insert into activity_registration values (null, '$activity->id', '$member->id', now(), 'open', null, $price, '$data', false, '$chosen_option[0]->start', '$chosen_option[0]->end')");
    $order_id = $connection->insert_id;
    $payment = $mollie->payments->create([
        "amount" => [
            "currency" => "EUR",
            "value" => $price
        ],
        "description" => $activity->name,
        "redirectUrl" => $config["SERVER_URL"].$redirect,
        "webhookUrl" => $config["NGROK_URL"]."/api/activity/updatePayment.php",
        "metadata" => [
            "order_id" => $order_id,
            "member_id" => $member->id,
            "user_id" => $user->id
        ]
    ]);
    $connection->query("update activity_registration set payment_id = '$payment->id' where id = '$order_id'");
    $result->checkout = $payment->getCheckoutUrl();
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);

function double($d): string {
    return number_format($d, 2, '.', '');
}

