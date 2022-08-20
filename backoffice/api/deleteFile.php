<?php
$response = array();
try {
    if (unlink($_SERVER['DOCUMENT_ROOT'] . $_GET['dir'] . $_GET['name'])) {
        echo json_encode(array("success" => true, "message" => "Verwijderen succesvol!"));
    } else  {
        throw new RuntimeException('Fout bij het verwijderen!');
    }
} catch (RuntimeException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
}