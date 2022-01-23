<?php
include $_SERVER['DOCUMENT_ROOT'] . '/connect.php';
$result = '';
$userlistquery = mysqli_query($connection, "select Voornaam, Achternaam from profiel");
while ($user = mysqli_fetch_assoc($userlistquery)) {
    $result = $result.'<option>'.$user['Voornaam'].' '.$user['Achternaam'].'</option>';
}
echo $result;

$myArray = array();
if ($result = $connection->query("select Voornaam, Achternaam from profiel")) {
    while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        $myArray[] = $row;
    }
    echo json_encode($myArray);
}
$result->close();
$connection->close();