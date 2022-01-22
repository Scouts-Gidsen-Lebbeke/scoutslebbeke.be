<?php
// get user info
$q = $_REQUEST["q"];
$result = mysqli_query($connection,"select * from profiel where username='$q'");
$row = mysqli_fetch_assoc($result);
$result2 = mysqli_query($connection,"select * from login where username='$q'");
$row2 = mysqli_fetch_assoc($result2);
$voornaam = $row['Voornaam'];
$achternaam = $row['Achternaam'];
$bijnaam = $row['Bijnaam'];
$totem = $row['Totem'];
$gsm = '0'.substr($row['Gsm'],0,3).'/'.substr($row['Gsm'],3,2).'.'.substr($row['Gsm'],5,2).'.'.substr($row['Gsm'],7,2);
$email = $row['Email'];
$functie = $row['Functie'];
$imagelink = $row['Foto'];
$rank = $row2['rank'];
$hoofd = $row['Hoofd'];
$takleiding = $row['Takleiding'];
// handle user changes
if (isset($_POST['saveprofile'])) {
    $q = $_REQUEST["q"];
    if (empty($_POST['firstname']) || empty($_POST['lastname'])) {
        $error14 = "Naamvelden kunnen niet leeg zijn!";
    } else if ($ownrank<$_POST['ranklist']) {
        function sec($data){
            global $connection;
            $data = stripslashes($data);
            $data = mysqli_real_escape_string($connection, $data);
            return $data;
        }
        $utdvoornaam = sec($_POST['firstname']);
        $utdachternaam = sec($_POST['lastname']);
        $utdbijnaam = sec($_POST['nickname']);
        $utdtotem = sec($_POST['totem']);
        $utdstraat = sec($_POST['streetname']);
        $utdhuisnummer = sec($_POST['housenumber']);
        $utdgemeente = sec($_POST['city']);
        $utdgsm = sec($_POST['gsm']);
        $utdgsm = preg_replace('/[^0-9]+/', '', $utdgsm);
        $utdemail = sec($_POST['email']);
        $utdfunctie = $_POST['functionlist'];
        $utdrank = $_POST['ranklist'];
        if (isset($_POST['hoofd'])) {
            $utdhoofd=1;
        } else {
            $utdhoofd=0;
        }
        if (isset($_POST['takleiding'])) {
            $utdtakleiding=1;
        } else {
            $utdtakleiding=0;
        }
        $update = mysqli_query($connection, "update profiel set Voornaam='$utdvoornaam', Achternaam='$utdachternaam', Bijnaam='$utdbijnaam', Totem='$utdtotem', Straatnaam='$utdstraat', Huisnummer='$utdhuisnummer', Gemeente='$utdgemeente', Gsm='$utdgsm', Functie='$utdfunctie', Email='$utdemail', Groepsleiding='$utdhoofd', Takleiding='$utdtakleiding' where username='$q'" );
        $update2 = mysqli_query($connection, "update login set rank='$utdrank' where username='$q'");
        if ($update&&$update2) {
            header("location: gebruikers.php");
        } else {
            $error14 = "Er is iets fout gegaan, probeer later opnieuw!";
        }
    } else if ($q==$login_key){
        $error14 = 'Pas je eigen profiel aan bij \'Profiel\'!';
    }
}