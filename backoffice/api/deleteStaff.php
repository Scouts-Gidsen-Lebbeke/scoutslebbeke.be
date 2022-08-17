<?php

include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $username = $_POST['staff-username'];
    if (!mysqli_query($connection, "delete from profiel where username='$username'")) {
        throw new RuntimeException("Er ging iets fout bij het verwijderen van de leid(st)er, probeer later opnieuw!");
    }
    echo json_encode(array("success" => true, "message" => "De leid(st)er werd succesvol verwijderd!"));
} catch (RuntimeException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
