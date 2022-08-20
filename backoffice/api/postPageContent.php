<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $file = $_SERVER['DOCUMENT_ROOT'] . '/pages/' . $_POST['page-list'] . '.html';
    if (!file_put_contents($file, $_POST['page-content'])) {
        throw new RuntimeException("Er ging iets fout bij het updaten van de pagina, probeer later opnieuw!");
    }
    echo json_encode(array("success" => true, "message" => "De pagina werd succesvol bewaard!"));
} catch (RuntimeException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
