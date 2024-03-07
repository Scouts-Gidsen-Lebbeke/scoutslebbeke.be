<?php
require 'init_mollie.php';

$id = $_GET["id"];
$result = new stdClass();
try {
    $payment = $mollie->payments->get($id);
    if ($payment->isPaid()) {
        $result->feedback = "We hebben jouw betaling intussen ontvangen.";
    } else {
        $result->checkout = $payment->getCheckoutUrl();
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
}
echo json_encode($result);