<?php
require '../getInternalLogin.php';

guardAdmin();
$result = new stdClass();
try {
    $role_id = $_GET["id"];
    $role = mysqli_fetch_object($connection->query("select * from role where id = $role_id"));
    if ($role->level == 4 && mysqli_fetch_column($connection->query("select count(*) from role where level = 4")) == 1) {
        throw new InvalidArgumentException("Deze rol mag niet verwijderd worden, er moet steeds minstens één admin-rol zijn!");
    }
    if (!$connection->query("delete from role where id = $role_id")) {
        $result->error = "Er ging iets mis bij het verwijderen van de rol, probeer het opnieuw!";
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
    $connection->close();
}
echo json_encode($result);

