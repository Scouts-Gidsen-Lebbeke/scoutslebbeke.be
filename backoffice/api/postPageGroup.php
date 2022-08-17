<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $id = $_POST['group-id'];
    $name = $_POST['group-name'];
    if (empty($name)) {
        throw new RuntimeException("Naam kan niet leeg zijn!");
    }
    if (empty($id)) {
        $max_id_result = $connection->query("select max(id) from page_groups")->fetch_assoc();
        $max_id = intval(reset($max_id_result)) + 1;
        if (!mysqli_query($connection, "insert into page_groups values ('$max_id', '$name', '$max_id')")) {
            throw new RuntimeException("Er ging iets fout bij het aanmaken van de nieuwe groep, probeer later opnieuw!");
        }
    } else if (!mysqli_query($connection, "update page_groups set name='$name' where id='$id'")) {
        throw new RuntimeException("Er ging iets fout bij het updaten van de groep, probeer later opnieuw!");
    }
    echo json_encode(array("status" => "success", "error" => false, "message" => "De groep werd succesvol opgeslagen!"));
} catch (RuntimeException $e) {
    echo json_encode(array("status" => "error", "error" => true, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
