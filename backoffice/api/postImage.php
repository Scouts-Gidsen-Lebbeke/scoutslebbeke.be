<?php
$response = array();
try {
    $target_dir = $_GET['dir'];
    $target_name = empty($_GET['name']) ? $_FILES['upfile']['name'] : empty($_GET['name']);
    if ($_FILES['upfile']['size'] > 50000000) {
        throw new RuntimeException('Te groot bestand! Maximaal 50MB.');
    }
    if (!str_starts_with(mime_content_type($_FILES['upfile']['tmp_name']), 'image/')) {
        throw new RuntimeException('Enkel afbeeldingsbestanden toegelaten!');
    }
    $target_file = $_SERVER['DOCUMENT_ROOT'] . $target_dir . basename($_FILES["upfile"]["name"]);
    if (move_uploaded_file($_FILES["upfile"]["tmp_name"], $target_file)) {
        echo json_encode(array("success" => true, "message" => "Upload succesvol!"));
    } else  {
        throw new RuntimeException('Fout bij het uploaden!');
    }

} catch (RuntimeException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}