<?php
if (isset($_POST['savepassword'])) {
    if (empty($_POST['oldpw']) || empty($_POST['newpw1']) || empty($_POST['newpw2'])) {
        $error3 = "Gelieve alle velden in te vullen!";
    } else {
        function safepw($password){
            return strlen($password) >= 6 && preg_match('~[0-9]~', $password) && preg_match('~[a-z]~', $password);
        }
        $username = $_SESSION['login_user'];
        $input = $_POST['oldpw'];
        $correctquery = mysqli_query($connection, "select password from login where username='$username'");
        $correctpwsub = mysqli_fetch_assoc($correctquery);
        $correctpw = $correctpwsub['password'];
        if (strcmp($correctpw, $input) !== 0){
            $error3 = 'Oud wachtwoord is incorrect!';
        } else if (strcmp($_POST['newpw1'],$_POST['newpw2']) !== 0){
            $error3 = 'Wachtwoorden komen niet overeen!';
        } else if (strcmp($correctpw, $_POST['newpw1']) == 0){
            $error3 = 'Oud en nieuw wachtwoord mogen niet hetzelfde zijn!';
        } else if (!safepw($_POST['newpw1'])){
            $error3= 'Nieuw wachtwoord moet cijfers en letters bevatten en minstens 6 tekens lang zijn!';
        } else {
            $newpw = password_hash($_POST['newpw1'], PASSWORD_DEFAULT);
            $update = mysqli_query($connection, "update login set password='$newpw' where username='$username'");
            if ($update) {
                header("location: profiel.php");
            } else {
                $error3 = "Er is iets fout gegaan, probeer later opnieuw!";
            }
        }
    }
}