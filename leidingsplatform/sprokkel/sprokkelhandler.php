<?php
$response = array();
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
    if ($_FILES['upfile']['size'] > 10000000) {
        throw new RuntimeException('Te groot bestand! Maximaal 10MB.');
    }
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    if (false === $ext = array_search($finfo->file($_FILES['upfile']['tmp_name']), array('pdf' => 'application/pdf'), true)) {
        throw new RuntimeException('Enkel pdf-bestanden toegelaten!');
    }
    $target_file = "../../sprokkel/" . basename($_FILES["upfile"]["name"]);
    $oldfile = '../../sprokkel/sprokkel.pdf';
    if (unlink($oldfile) && move_uploaded_file($_FILES["upfile"]["tmp_name"], $target_file)) {
        rename($target_file, $oldfile);
    } else  {
        throw new RuntimeException('Fout bij het uploaden!');
    }
    $response = array("status" => "success", "error" => false, "message" => "Upload succesvol!");
    echo json_encode($response);

} catch (RuntimeException $e) {
    $response = array("status" => "error", "error" => true, "message" => $e->getMessage());
    echo json_encode($response);
}