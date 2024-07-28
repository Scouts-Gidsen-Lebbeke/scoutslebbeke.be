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
    $form = mysqli_real_escape_string($connection, $_POST['additional']);
    $form = !empty($form) ? "'$form'" : "NULL";
    $rule = mysqli_real_escape_string($connection, $_POST['rule']);
    $rule = !empty($rule) ? "'$rule'" : "NULL";
    if ($id) {
        $result->succes = mysqli_query($connection, "update activity set title = '$title', content = '$content', visible = '$visible', image = $image where id='$id'");
    } else {
        $result->succes = mysqli_query($connection, "insert into activity values (null, '$name', '$start', '$end', $price, $sibling_reduction, '$open_subscription', '$close_subscription', '$location_id', '$info', '$practical', $form, $rule)");
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);