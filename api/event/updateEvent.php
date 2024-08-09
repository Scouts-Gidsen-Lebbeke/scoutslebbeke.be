<?php
require "../getInternalLogin.php";

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
    if (strtotime($start) < time()) {
        throw new InvalidArgumentException("De startdatum mag niet in het verleden liggen!");
    }
    $end = $_POST['end'];
    if (empty($end)) {
        throw new InvalidArgumentException("De einddatum is verplicht!");
    }
    if (strtotime($start) > strtotime($end)) {
        throw new InvalidArgumentException("De einddatum mag niet voor de startdatum liggen!");
    }
    $open = $_POST['open'];
    if (empty($open)) {
        throw new InvalidArgumentException("De start van de registraties is verplicht!");
    }
    $close = $_POST['close'];
    if (empty($close)) {
        throw new InvalidArgumentException("De registratiedeadline is verplicht!");
    }
    if (strtotime($open) > strtotime($close)) {
        throw new InvalidArgumentException("De registratiedeadline mag niet voor de start van de inschrijvingen liggen!");
    }
    if (strtotime($close) > strtotime($start)) {
        throw new InvalidArgumentException("De registratiedeadline mag niet na de start van het evenement liggen!");
    }
    $location_id = $_POST['location'];
    if (empty($location_id)) {
        throw new InvalidArgumentException("De locatie is verplicht!");
    }
    $info = mysqli_real_escape_string($connection, $_POST['info']);
    if (empty($info)) {
        throw new InvalidArgumentException("De introductietekst is verplicht!");
    }
    $form = mysqli_real_escape_string($connection, $_POST['additional']);
    $form = !empty($form) ? "'$form'" : "NULL";
    $rule = $_POST['rule'];
    if ($rule == "") {
        throw new InvalidArgumentException("De prijsregel is verplicht!");
    }
    if ($id) {
        $result->succes = mysqli_query($connection, "update event set name = '$name', start = '$start', end = '$end', open_registration = '$open', close_registration = '$close', location_id = $location_id, info = '$info', additional_form = $form, additional_form_rule = $rule where id='$id'");
    } else {
        $result->succes = mysqli_query($connection, "insert into event values (null, '$name', '$start', '$end', '$open', '$close', '$location_id', '$info', $form, $rule)");
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);