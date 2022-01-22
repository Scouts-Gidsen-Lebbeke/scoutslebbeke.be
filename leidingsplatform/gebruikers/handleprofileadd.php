<?php
if (isset($_POST['addprofile'])) {
    if (empty($_POST['firstname']) || empty($_POST['lastname'])){
        $error13 = 'Voornaam en achternaam mogen niet leeg zijn!';
    } else {
        function sec($data){
            global $connection;
            $data = stripslashes($data);
            $data = mysqli_real_escape_string($connection, $data);
            return $data;
        }
        $newvoornaam = sec($_POST['firstname']);
        $newvoornaam = strtoupper(substr($newvoornaam, 0, 1)) . substr($newvoornaam, 1);
        $newachternaam = sec($_POST['lastname']);
        $newachternaam = strtoupper(substr($newachternaam, 0, 1)) . substr($newachternaam, 1);
        $newbijnaam = sec($_POST['nickname']);
        $newtotem = sec($_POST['totem']);
        $newgsm = sec($_POST['gsm']);
        $newgsm = preg_replace('/[^0-9]+/', '', $newgsm);
        $newemail = $_POST['email'];
        $newfunctie = $_POST['functionlist'];
        $newhoofd = isset($_POST['hoofd']) ? 1 : 0;
        $newrank = $_POST['ranklist'];
        $existsquery = mysqli_query($connection, "select * from profiel where voornaam='$newvoornaam' and achternaam='$newachternaam'");
        $rows = mysqli_num_rows($existsquery);
        if ($rows == 0) {
            $achternaamlist = explode(' ',$newachternaam);
            $newusername = $newvoornaam;
            for ($i=0; $i<sizeof($achternaamlist); $i++){
                $newusername = $newusername.substr($achternaamlist[$i], 0,1);
            }
            $newusername = strtolower($newusername);
            $update = mysqli_query($connection, "insert into profiel values ('$newusername', '$newvoornaam', '$newachternaam', '$newbijnaam', '$newtotem','$newgsm', '$newemail', '$newfunctie', 'default.png', '$newhoofd')");
            if ($update) {
                header("location: gebruikers.php");
            } else {
                $error13 = "Er is iets fout gegaan, probeer later opnieuw!";
            }
        } else {
            $error13 = 'Gebruiker bestaat al!';
        }
    }
}