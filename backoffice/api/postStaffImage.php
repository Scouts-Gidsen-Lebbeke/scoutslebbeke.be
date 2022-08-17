<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $picBaseName = $_SERVER['DOCUMENT_ROOT'] . "/images/profile/";
    $username = $_POST['staff-username'];
    $tmpFile = $_FILES['staff-pic-upload']['tmp_name'];
    $filename = $_FILES['staff-pic-upload']['name'];
    if ($_FILES['staff-pic-upload']['size'] > 50000000) {
        throw new RuntimeException('Te groot bestand! Maximaal 50MB.');
    }
    if (!str_starts_with(mime_content_type($tmpFile), 'image/')) {
        throw new RuntimeException('Enkel afbeeldingsbestanden toegelaten!');
    }
    $target_file = $picBaseName . basename($filename);
    $oldFile = $picBaseName . $_POST['staff-pic-name'];
    $newFileBase = $username . "." . pathinfo($filename, PATHINFO_EXTENSION);
    if ((str_ends_with($oldFile, "default.png") || !file_exists($oldFile) || unlink($oldFile)) && move_uploaded_file($tmpFile, $target_file)) {
        rename($target_file, $picBaseName . $newFileBase);
        if (!mysqli_query($connection, "update profiel set Foto='$newFileBase' where username='$username'")) {
            throw new RuntimeException("Fout bij de profiel-update!");
        }
    } else  {
        throw new RuntimeException('Fout bij het uploaden!');
    }
    echo json_encode(array("success" => true, "message" => "Upload succesvol!", "new" => $newFileBase));
} catch (RuntimeException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}