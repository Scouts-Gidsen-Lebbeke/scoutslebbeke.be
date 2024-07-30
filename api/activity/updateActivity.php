<?php
require "../getInternalLogin.php";
require "restrictionLogic.php";

$user = guardAdmin();
$result = new stdClass();
try {
    $id = $_POST['id'];
    $name = mysqli_real_escape_string($connection, $_POST['name']);
    if (empty($name)) {
        throw new InvalidArgumentException("Een naam is verplicht!");
    }
    $start = $_POST['start'];
    if (empty($start)) {
        throw new InvalidArgumentException("De startdatum is verplicht!");
    }
    if ($id && strtotime($start) < time()) {
        throw new InvalidArgumentException("De startdatum mag bij nieuwe activiteiten niet in het verleden liggen!");
    }
    $end = $_POST['end'];
    if (empty($end)) {
        throw new InvalidArgumentException("De einddatum is verplicht!");
    }
    if (strtotime($start) > strtotime($end)) {
        throw new InvalidArgumentException("De einddatum mag niet voor de startdatum liggen!");
    }
    $price = $_POST['price'];
    if (empty($price)) {
        throw new InvalidArgumentException("De prijs is verplicht!");
    }
    if ($price < 0) {
        throw new InvalidArgumentException("De prijs kan niet negatief zijn!");
    }
    $reduction = $_POST['reduction'];
    if (empty($reduction)) {
        throw new InvalidArgumentException("De korting voor gezinsleden is verplicht!");
    }
    if ($reduction < 0) {
        throw new InvalidArgumentException("De korting voor gezinsleden kan niet negatief zijn!");
    }
    if ($reduction > $price) {
        throw new InvalidArgumentException("De korting voor gezinsleden kan niet hoger dan de prijs zijn!");
    }
    $open = $_POST['open'];
    if (empty($open)) {
        throw new InvalidArgumentException("De start van de inschrijvingen is verplicht!");
    }
    $close = $_POST['close'];
    if (empty($close)) {
        throw new InvalidArgumentException("De inschrijvingsdeadline is verplicht!");
    }
    if (strtotime($open) > strtotime($close)) {
        throw new InvalidArgumentException("De inschrijvingsdeadline mag niet voor de start van de inschrijvingen liggen!");
    }
    $location_id = $_POST['location'];
    if (empty($location_id)) {
        throw new InvalidArgumentException("De locatie is verplicht!");
    }
    $info = mysqli_real_escape_string($connection, $_POST['info']);
    if (empty($info)) {
        throw new InvalidArgumentException("De introductietekst is verplicht!");
    }
    $practical = mysqli_real_escape_string($connection, $_POST['practical']);
    $practical = !empty($practical) ? "'$practical'" : "NULL";
    $form = mysqli_real_escape_string($connection, $_POST['additional']);
    $form = !empty($form) ? "'$form'" : "NULL";
    $rule = mysqli_real_escape_string($connection, $_POST['rule']);
    $rule = !empty($rule) ? "'$rule'" : "NULL";
    $json = json_decode($_POST['restrictions']);
    $restrictions = parse_restrictions($json);
    if ($id) {
        $result->succes = mysqli_query($connection, "update activity set name = '$name', start = '$start', end = '$end', price = $price, sibling_reduction = $reduction, open_subscription = '$open', close_subscription = '$close', location_id = $location_id, info = '$info', practical_info = '$practical', additional_form = '$form', additional_form_rule = '$rule' where id='$id'");
    } else {
        $result->succes = mysqli_query($connection, "insert into activity values (null, '$name', '$start', '$end', $price, $reduction, '$open', '$close', '$location_id', '$info', '$practical', $form, $rule)");
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);