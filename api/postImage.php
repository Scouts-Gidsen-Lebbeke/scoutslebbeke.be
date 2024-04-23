<?php
require 'getInternalLogin.php';

guardStaff();
$result = new stdClass();
$result->succes = false;
try {
    $target_dir = $_GET['dir'];
    $target_name = empty($_GET['name']) ? uniqid() : $_GET['name'];
    if ($_FILES['upfile']['size'] > 50000000) {
        throw new RuntimeException('Te groot bestand! Maximaal 50MB.');
    }
    if (!str_starts_with(mime_content_type($_FILES['upfile']['tmp_name']), 'image/')) {
        throw new RuntimeException('Enkel afbeeldingsbestanden toegelaten!');
    }
    $target_full_name = $target_name . "." . pathinfo($_FILES["upfile"]["name"], PATHINFO_EXTENSION);
    $target_from_root = "/uploads/" . $target_dir . "/" . $target_full_name;
    $target_file = $_SERVER['DOCUMENT_ROOT'] . $target_from_root;
    if (move_uploaded_file($_FILES["upfile"]["tmp_name"], $target_file)) {
        $result->succes = true;
        $result->name = $target_full_name;
        $result->location = $target_from_root;
    } else  {
        throw new RuntimeException('Fout bij het uploaden!');
    }

} catch (RuntimeException $e) {
    $result->message = $e->getMessage();
}
echo json_encode($result);