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
    $price = $_POST['price'];
    if (empty($price)) {
        throw new InvalidArgumentException("De prijs is verplicht!");
    }
    if ($price < 0) {
        throw new InvalidArgumentException("De prijs kan niet negatief zijn!");
    }
    $reduction = $_POST['reduction'];
    if ($reduction === "") {
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
    if (strtotime($close) > strtotime($start)) {
        throw new InvalidArgumentException("De inschrijvingsdeadline mag niet na de start van de activiteit liggen!");
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
    $connection->begin_transaction();
    if ($id) {
        $result->succes = mysqli_query($connection, "update activity set name = '$name', start = '$start', end = '$end', price = $price, sibling_reduction = $reduction, open_subscription = '$open', close_subscription = '$close', location_id = $location_id, info = '$info', practical_info = $practical, additional_form = $form, additional_form_rule = $rule where id='$id'");
        $result->succes = $result->succes && $connection->query("delete from activity_restriction where activity_id = '$id'");
    } else {
        $result->succes = mysqli_query($connection, "insert into activity values (null, '$name', '$start', '$end', $price, $reduction, '$open', '$close', '$location_id', '$info', $practical, $form, $rule)");
        $id = $connection->insert_id;
    }
    foreach ($restrictions as $r) {
        $r_name = !empty($r->name) ? "'$r->name'" : "NULL";
        $alter_start = $r->alter_start && $r->alter_start != $start ? "'$r->alter_start'" : "NULL";
        $alter_end = $r->alter_end && $r->alter_end != $end ? "'$r->alter_end'" : "NULL";
        $alter_price = $r->alter_price && $r->alter_price != $price ? "'$r->alter_price'" : "NULL";
        $result->succes = $result->succes && mysqli_query($connection, "insert into activity_restriction values (null, $id, '$r->branch_id', $r_name, $alter_start, $alter_end, $alter_price)");
    }
    if (!$result->succes) {
        throw new RuntimeException("Unable to update activity, rollback!");
    }
    $connection->commit();
} catch (Exception $e) {
    $connection->rollback();
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);