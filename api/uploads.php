<?php

function upload($file, $target_dir, $name = null): stdClass {
    $result = new stdClass();
    $result->succes = false;
    try {
        $target_name = empty($name ?? "") ? uniqid() : $name;
        if ($_FILES['upfile']['size'] > 50000000) {
            throw new RuntimeException('Te groot bestand! Maximaal 50MB.');
        }
        if (!str_starts_with(mime_content_type($file['tmp_name']), 'image/')) {
            throw new RuntimeException('Enkel afbeeldingsbestanden toegelaten!');
        }
        $target_full_name = $target_name . "." . pathinfo($file["name"], PATHINFO_EXTENSION);
        $target_from_root = "/images/" . $target_dir . "/" . $target_full_name;
        $target_file = $_SERVER['DOCUMENT_ROOT'] . $target_from_root;
        if (move_uploaded_file($file["tmp_name"], $target_file)) {
            $result->succes = true;
            $result->name = $target_full_name;
            $result->location = $target_from_root;
        } else  {
            throw new RuntimeException('Fout bij het uploaden!');
        }

    } catch (RuntimeException $e) {
        $result->message = $e->getMessage();
    }
    return $result;
}
