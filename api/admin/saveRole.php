<?php
require '../getInternalLogin.php';

guardAdmin();
$result = new stdClass();
try {
    $role = json_decode(file_get_contents('php://input'));
    if (empty($role->external_id)) {
        throw new InvalidArgumentException("Geen geldige functie opgegeven!");
    }
    $succes = false;
    if ($role->id === "-1") {
        $succes = $connection->query("insert into role values (null, '$role->external_id', '$role->name', '$role->branch_id', '$role->staff_branch_id', '$role->level')");
    } else {
        $succes = $connection->query("update role set name = '$role->name', sgl_id = '$role->external_id', branch_id = '$role->branch_id', staff_branch_id = '$role->staff_branch_id', level = '$role->level' where id = '$role->id'");
    }
    if (!$succes) {
        $result->error = "Er ging iets mis bij het verwijderen van de rol, probeer het opnieuw!";
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
    $connection->close();
}
echo json_encode($result);
