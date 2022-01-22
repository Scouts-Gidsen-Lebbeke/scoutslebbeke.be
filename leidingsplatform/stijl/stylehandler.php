<?php
// handle style change
if (isset($_POST['savepagecontent'])) {
    $pointer = fopen('../../scoutslebbeke.css', 'w+');
    if ($pointer !== false) {
        $string = $_POST['pagecontent'];
        fwrite($pointer, $string);
    } else {
        $error10 = 'Aanpassing mislukt!';
    }
}
// handle image upload
if (isset($_POST['submit'])) {
    $target_file = "../../images/" . basename($_FILES["fileToUpload"]["name"]);
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    if (!getimagesize($_FILES["fileToUpload"]["tmp_name"])) {
        $error11 = 'Bestand voldoet niet aan de voorwaarden en is niet geüpload.';
    }
    $imageFileType = strtolower($imageFileType);
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
        $error11 = 'Bestand voldoet niet aan de voorwaarden en is niet geüpload.';
    }
    if ($error11 != '') {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $error11 = 'Afbeelding succesvol geüpload.';
        } else {
            $error11 = 'Er is een fout opgetreden bij het uploaden.';
        }
    }
}
