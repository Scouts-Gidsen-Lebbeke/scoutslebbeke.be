<?php
include "connect.php";
$result = array();
if ($query = $connection->query("select Voornaam from profiel where uniform")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        $result[] = $row["Voornaam"];
    }
}
$query->close();
$connection->close();
echo json_encode($result);
