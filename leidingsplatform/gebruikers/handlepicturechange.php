<?php
if (isset($_POST['submit'])) {
    $target_dir = "../../images/";
    $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);
    $uploadOk = 1;
    $imageFileType = pathinfo($target_file, PATHINFO_EXTENSION);
    $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    if ($check == false) {
        $uploadOk = 0;
    }
    if ($_FILES["fileToUpload"]["size"] > 500000) {
        $uploadOk = 0;
    }
    if ($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg") {
        $uploadOk = 0;
    }
    if ($uploadOk == 0) {
        $error15 = 'Bestand voldoet niet aan de voorwaarden en is niet geupload.';
    } else {
        $correctquery = mysqli_query($connection, "select Foto from profiel where username='$q'");
        $correctimgsub = mysqli_fetch_assoc($correctquery);
        $correctimg = $correctimgsub['Foto'];
        if ($correctimg != "default.png") {
            $oldfile = '../../images/' . $correctimg;
            unlink($oldfile);
        }
        if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file)) {
            $newname = $q . '.' . $imageFileType;
            rename($target_file, '../../images/' . $newname);
            mysqli_query($connection, "update profiel set Foto='$newname' where username='$q'");
            header("location: gebruikers.php");
        } else {
            $error15 = 'Er is een fout opgetreden.';
        }
    }
}
?>