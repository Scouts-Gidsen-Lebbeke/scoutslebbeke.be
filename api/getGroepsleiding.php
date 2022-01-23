<?php
include "connect.php";
$result = array();
if ($query = $connection->query("select Voornaam, Achternaam, Totem, Gsm, Foto from profiel where Groepsleiding")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        array_push($result, $row);
    }
}
$query->close();
$connection->close();
echo json_encode($result);