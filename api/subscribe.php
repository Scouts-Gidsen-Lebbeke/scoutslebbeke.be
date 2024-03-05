<?php
require 'getInternalLogin.php';
require 'init_mollie.php';

$user = getUser(true, true);
$event_id = $_GET['id'];
$event = mysqli_fetch_object($connection->query("select * from event where id = '$event_id'"));
$event_restriction = mysqli_fetch_object($connection->query("select * from event_restriction where event_id = '$event->id' and branch_id = '$user->branch'"));
$connection->query("insert into event_registration values (null, '$event_id', '$user->id', now(), 'open', null)");
$order_id = $connection->insert_id;
$payment = $mollie->payments->create([
    "amount" => [
        "currency" => "EUR",
        "value" => double($event_restriction->alter_price ?? $event->price)
    ],
    "description" => $event->name,
    "redirectUrl" => $config["SERVER_URL"] . "/activity/" . $event_id . "?payment_return=true",
    "webhookUrl"  => $config["NGROK_URL"] . "/api/updatePayment.php",
    "metadata" => [
        "order_id" => $order_id,
        "user_id" => $user->id
    ]
]);
$connection->query("update event_registration set payment_id = '$payment->id' where id = '$order_id'");
//header("Location: " . $payment->getCheckoutUrl(), true, 303);
echo json_encode($payment->getCheckoutUrl());

function double($d): string {
    return number_format($d, 2, '.', '');
}

