<?php
require '../init_mollie.php';
require '../getInternalLogin.php';

$result = new stdClass();
try {
    //$user = getUser();
    $event_id = $_GET['id'];
    $event = mysqli_fetch_object($connection->query("select * from event where id = '$event_id'"));
    if ($event == null) {
        throw new InvalidArgumentException("Er liep iets mis bij het vinden van het evenement, probeer later opnieuw!");
    }
    if (strtotime($event->open_registration) > time()) {
        throw new InvalidArgumentException("De inschrijvingen voor dit evenement zijn nog niet geopend!");
    }
    if (strtotime($event->close_registration) < time()) { // && (empty($user) || !$user->level->isAdmin())
        throw new InvalidArgumentException("De inschrijvingen voor dit evenement zijn gesloten!");
    }
    $first_name = mysqli_real_escape_string($connection, $_POST['first-name']);
    if ($first_name == null) {
        throw new InvalidArgumentException("Gelieve een geldige voornaam op te geven!");
    }
    unset($_POST['first-name']);
    $last_name = mysqli_real_escape_string($connection, $_POST['last-name']);
    if ($last_name == null) {
        throw new InvalidArgumentException("Gelieve een geldige achternaam op te geven!");
    }
    unset($_POST['last-name']);
    $email = mysqli_real_escape_string($connection, $_POST['email']);
    if ($email == null) {
        throw new InvalidArgumentException("Gelieve een geldig e-mailadres op te geven!");
    }
    unset($_POST['email']);
    $mobile = mysqli_real_escape_string($connection, $_POST['mobile']);
    if ($mobile == null) {
        if ($event->needsMobile) {
            throw new InvalidArgumentException("Gelieve een geldig telefoonnummer op te geven!");
        }
        $mobile = "NULL";
    } else {
        $mobile = "'".normalizeMobile($mobile)."'";
    }
    unset($_POST['mobile']);
    $price = double($_POST['price']);
    unset($_POST['price']);
    $data = mysqli_real_escape_string($connection, json_encode($_POST));
    $connection->query("insert into event_registration values (null, '$event->id', '$first_name', '$last_name', '$email', $mobile, now(), 'open', null, $price, '$data')");
    $order_id = $connection->insert_id;
    $customer = $mollie->customers->create([
        "name" => $first_name." ".$last_name,
        "email" => $email,
    ]);
    $payment = $customer->createPayment([
        "amount" => [
            "currency" => "EUR",
            "value" => $price
        ],
        "description" => $event->name,
        "redirectUrl" => $config["APP_URL"]."/event/confirmation.html?id=".$event->id."&order_id=".$order_id,
        "webhookUrl" => $config["APP_REMOTE_URL"]."/api/event/updatePayment.php",
        "metadata" => [
            "order_id" => $order_id,
        ]
    ]);
    $connection->query("update event_registration set payment_id = '$payment->id' where id = '$order_id'");
    $result->checkout = $payment->getCheckoutUrl();
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);

