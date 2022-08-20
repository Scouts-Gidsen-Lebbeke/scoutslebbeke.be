<?php
$response = array();
$target_dir = $_GET['dir'];
$target_name = $_GET['name'];
try {
    if (!isset($_FILES['upfile']['error']) || is_array($_FILES['upfile']['error'])) {
        throw new RuntimeException('Geen geldig bestand!');
    }
    switch ($_FILES['upfile']['error']) {
        case UPLOAD_ERR_OK:
            break;
        case UPLOAD_ERR_NO_FILE:
            throw new RuntimeException('Geen geldig bestand!');
        case UPLOAD_ERR_INI_SIZE:
        case UPLOAD_ERR_FORM_SIZE:
            throw new RuntimeException('Te groot bestand! Maximaal 10MB.');
        default:
            throw new RuntimeException('Geen geldig bestand!');
    }
    if ($_FILES['upfile']['size'] > 50000000) {
        throw new RuntimeException('Te groot bestand! Maximaal 50MB.');
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search($finfo->file($_FILES['upfile']['tmp_name']), array('pdf' => 'application/pdf'), true)) {
        throw new RuntimeException('Enkel pdf-bestanden toegelaten!');
    }
    $target_file = $_SERVER['DOCUMENT_ROOT'] . $target_dir . basename($_FILES["upfile"]["name"]);
    $oldfile = $_SERVER['DOCUMENT_ROOT'] . $target_dir . $target_name .'.pdf';
    if (unlink($oldfile) && move_uploaded_file($_FILES["upfile"]["tmp_name"], $target_file)) {
        rename($target_file, $oldfile);
    } else  {
        throw new RuntimeException('Fout bij het uploaden!');
    }
    $response = array("success" => true, "message" => "Upload succesvol!");
    echo json_encode($response);

} catch (RuntimeException $e) {
    $response = array("success" => false, "message" => $e->getMessage());
    echo json_encode($response);
}