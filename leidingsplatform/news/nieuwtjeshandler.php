<?php
// handle the addition of a new item
if (isset($_POST['savenewitem'])) {
    if("" !== trim($_POST['itemtitle'])&&"" !== trim($_POST['itemcontent'])) {
        $currentcontent = file_get_contents('../../nieuwtjes/nieuwtjes.html',false, null,18);
        $pointer = fopen('../../nieuwtjes/nieuwtjes.html', 'w+');
        if ($pointer !== false && $currentcontent !== false) {
            $newitem = '<h2>' . $_POST['itemtitle'] . '</h2><p>' . $_POST['itemcontent'];
            if ($_FILES['picToUpload']['size'] != 0) {
                $target_dir = "../../images/";
                $target_name = basename($_FILES["picToUpload"]["name"]);
                $target_file = $target_dir . $target_name;
                $uploadOk = 1;
                $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
                $check = getimagesize($_FILES["picToUpload"]["tmp_name"]);
                if ($check == false) {
                    $error7 = 'Afbeelding voldoet niet aan de voorwaarden, nieuwtje is niet toegevoegd.';
                    $uploadOk = 0;
                }
                $imageFileType = strtolower($imageFileType);
                if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
                    $error7 = 'Afbeelding voldoet niet aan de voorwaarden, nieuwtje is niet toegevoegd.';
                    $uploadOk = 0;
                }
                if ($uploadOk == 1) {
                    if (move_uploaded_file($_FILES["picToUpload"]["tmp_name"], $target_file)) {
                        $newitem = $newitem . '<br><img class="afbIndex" src="../images/' . $target_name . '"/></p><hr>';
                    } else {
                        $error7 = 'Er is een fout opgetreden bij het uploaden van de afbeelding, nieuwtje is niet toegevoegd.';
                    }
                }
            } else {
                $newitem = $newitem . '</p><hr>';
            }
            $newcontent = '<h1>Nieuwtjes</h1>' . $newitem . $currentcontent;
            if (fwrite($pointer, $newcontent) !== false) {
                $error7 = 'Nieuwtje succesvol toegevoegd!';
            }
        } else {
            $error7 = 'Toevoegen van nieuwtje is niet gelukt!';
        }
    } else {
        $error7 = 'Titel en inhoud van nieuwtje mogen niet leeg zijn!';
    }
}
// handle the upload of a picture
if (isset($_POST['submit'])) {
    $target_dir = "../../images/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    $error5 = $check;
    if ($check == false) {
        $error5 = $error5.'Bestand voldoet niet aan de voorwaarden en is niet geupload.';
        $uploadOk = 0;
    }
    $imageFileType = strtolower($imageFileType);
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
        $error5 = 'Bestand voldoet niet aan de voorwaarden en is niet geupload.';
        $uploadOk = 0;
    }
    if ($uploadOk == 0) {
        //
    } else {
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $error5 = 'Afbeelding succesvol geupload.';
        } else {
            $error5 = 'Er is een fout opgetreden bij het uploaden.';
        }
    }
}
// handle contentchange
if (isset($_POST['savepagecontent'])) {
    $pointer = fopen('../../nieuwtjes/nieuwtjes.html', 'w+');
    if ($pointer!==false){
        $string = $_POST['pagecontent'];
        fwrite($pointer, $string);
    } else {
        $error6 = 'Aanpassing mislukt!';
    }
}