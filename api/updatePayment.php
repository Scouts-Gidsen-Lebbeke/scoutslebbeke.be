<?php
use Mollie\Api\Exceptions\ApiException;

require "init_mollie.php";
require "connect.php";

try {
    $payment = $mollie->payments->get($_POST["id"]);
    $order_id = $payment->metadata->order_id;
    $user_id = $payment->metadata->user_id;
    $connection->query("update event_registration set status = '$payment->status' where id = '$order_id'");
    database_write($order_id, $payment->status);
    if ($payment->isPaid() && !$payment->hasRefunds() && !$payment->hasChargebacks()) {
        // mail confirmation
    }
} catch (ApiException $e) {
    echo "API call failed: " . htmlspecialchars($e->getMessage());
}
