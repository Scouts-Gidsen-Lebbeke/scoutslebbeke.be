<?php
require 'getInternalLogin.php';
require 'init_mollie.php';

$user = updateUser($sgl_user);
$event_id = $_GET['id'];
$event = mysqli_fetch_object($connection->query("select * from event where id = '$event_id'"));
$connection->query("insert into event_registration values (null, '$event_id', '$user->id', now(), 'open', null)");
$order_id = $connection->insert_id;
$payment = $mollie->payments->create([
    "amount" => [
        "currency" => "EUR",
        "value" => double($event->price - ($user->staff ? $event->staff_reduction : 0))
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
header("Location: " . $payment->getCheckoutUrl(), true, 303);

function double($d): string {
    return number_format($d, 2, '.', '');
}

