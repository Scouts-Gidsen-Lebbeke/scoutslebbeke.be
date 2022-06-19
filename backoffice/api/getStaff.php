<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$filter = strcmp($_GET['q'], 'true') === 0 ? " where Functie != 'Stam'" : "";
$myArray = array();
if ($result = $connection->query("select username, Voornaam, Achternaam from profiel" . $filter)) {
    while ($row = $result->fetch_assoc()) {
        array_push($myArray, $row);
    }
    echo json_encode(array("success" => true, "list" => $myArray));
    $result->close();
} else {
    echo json_encode(array("success" => false));
}
$connection->close();