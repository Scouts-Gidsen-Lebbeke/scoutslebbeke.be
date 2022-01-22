<?php
// default user photo
$imagelink = 'default.png';
// handle user selection
if (isset($_POST['selectuser'])) {
    $nameparts = explode(' ', $_POST['userList'], 2);
    $result = mysqli_query($connection,"select * from profiel where Voornaam='$nameparts[0]' and Achternaam='$nameparts[1]'");
    $row = mysqli_fetch_assoc($result);
    $username2 = $row['username'];
    $voornaam = $row['Voornaam'];
    $achternaam = $row['Achternaam'];
    $bijnaam = $row['Bijnaam'];
    $totem = $row['Totem'];
    $gsm = '0' . substr($row['Gsm'], 0, 3) . '/' . substr($row['Gsm'], 3, 2) . '.' . substr($row['Gsm'], 5, 2) . '.' . substr($row['Gsm'], 7, 2);
    $email = $row['Email'];
    $functie = $row['Functie'];
    $imagelink = $row['Foto'];
    $hoofd = $row['Hoofd'];
    $takleiding = $row['Takleiding'];
}
// handle user removal
if (isset($_POST['deleteuser'])) {
    $username3 = $_POST['username'];
    $checkfoto = mysqli_query($connection, "select Foto from profiel where username='$username3'");
    $checkdel = mysqli_query($connection, "delete from profiel where username='$username3'");
    $checkfotosub = mysqli_fetch_assoc($checkfoto);
    $checkfotorow = $checkfotosub['Foto'];
    $checkdelfoto = true;
    if ($checkfotorow != "default.png") {
        $oldfile = '../../images/' . $checkfotorow;
        $checkdelfoto = unlink($oldfile);
    }
    if ($checkdel && $checkdelfoto) {
        $error13 = 'Verwijderen van de gebruiker succesvol.';
    } elseif ($checkdel) {
        $error13 = 'De gebruiker is succesvol verwijderd, maar er liep iets mis bij het verwijderen van de foto.';
    } else {
        $error13 = 'Er is iets foutgegaan bij het verwijderen van de gebruiker, probeer later opnieuw.';
    }
}