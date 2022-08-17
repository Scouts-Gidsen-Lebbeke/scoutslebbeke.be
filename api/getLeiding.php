<?php
include "connect.php";
$tak = $_GET['q'];
$result = array();
if ($q = $connection->query("select setting_value from settings where setting_id='staff_visible'")) {
    if (filter_var(mysqli_fetch_assoc($q)['setting_value'], FILTER_VALIDATE_BOOLEAN) &&
        $query = $connection->query("select Voornaam, Achternaam, kapoenenbijnaam, welpenbijnaam, Totem, Gsm, (select default_email from functions where function=Functie) as Email, Foto, Takleiding from profiel where Functie='$tak' order by Takleiding desc")) {
        while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
            array_push($result, $row);
        }
        $query->close();
    }
}
$q->close();
$connection->close();
echo json_encode($result);