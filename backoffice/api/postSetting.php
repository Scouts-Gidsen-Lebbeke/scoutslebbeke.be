<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $value = $_POST['sprokkelBtn'];
    $id = $_GET['q'];
    if (!mysqli_query($connection, "update settings set setting_value='$value' where setting_id='$id'")) {
        throw new RuntimeException("Er ging iets fout bij het updaten van de periode, probeer later opnieuw!");
    }
    echo json_encode(array("status" => "success", "error" => false, "message" => "De periode werd succesvol opgeslagen!"));
} catch (RuntimeException $e) {
    echo json_encode(array("status" => "error", "error" => true, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
