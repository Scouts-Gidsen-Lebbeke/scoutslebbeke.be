<?php
require 'getInternalLogin.php';

function getSubscriptionState($user) {
    global $connection;
    $result = new stdClass();
    try {
        $event_id = $_GET['id'];
        if ($user->med_date < strtotime("-1 year", time())) {
            throw new InvalidArgumentException("Jouw medische fiche is al meer dan een jaar niet aangevuld, update deze eerst in de Groepsadministratie!");
        }
        $result->registration = mysqli_fetch_object($connection->query("select * from event_registration where user_id = '$user->id' and event_id = '$event_id' and payment_id is not null and status not in ('canceled', 'expired', 'failed') order by date desc limit 1"));
        if ($result->registration == null) {
            $event = mysqli_fetch_object($connection->query("select * from event where id = '$event_id'"));
            if ($event == null) {
                throw new InvalidArgumentException("Er liep iets mis bij het vinden van de activiteit, probeer later opnieuw!");
            }
            $result->event = $event;
            if ($event->open_subscription > time() && !$user->isAdmin) {
                $result->open_subscription = $event->open_subscription;
            }
            $event_restriction = mysqli_fetch_object($connection->query("select * from event_restriction where event_id = '$event->id' and branch_id = '$user->branch'"));
            if ($event_restriction == null) {
                throw new InvalidArgumentException("Deze activiteit is niet voor jouw tak!");
            }
            $result->price = getPrice($event_restriction, $event, $user);
        }
    } catch (Exception $e) {
        $result->error = $e->getMessage();
    }
    return $result;
}

function getPrice($event_restriction, $event, $user) {
    $base_price = $event_restriction->alter_price ?? $event->price;
    return $user->som ? ceil($base_price / 3) : $base_price;
}