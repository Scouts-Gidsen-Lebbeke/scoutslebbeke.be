<?php
include 'connect.php';
$result = array();
if ($query = $connection->query("select Voornaam, Achternaam, Gsm from profiel where Groepsleiding=1 AND Gsm IS NOT NULL")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        array_push($result, $row);
    }
}
$query->close();
$connection->close();
echo json_encode($result);
