<?php
include $_SERVER['DOCUMENT_ROOT'] . '/connect.php';
$error='';
if (isset($_POST['submit'])) {
    if (empty($_POST['username']) || empty($_POST['password'])) {
        $error = "Gebruikersnaam en/of wachtwoord is fout!";
    } else {
        $username = sec($_POST['username']);
        $password = sec($_POST['password']);
        $query = $connection->query("select password from login where username='$username'");
        if (mysqli_num_rows($query) == 1 && password_verify($password, mysqli_fetch_assoc($query)['password'])) {
            session_start();
            $_SESSION['login_user'] = $username;
            header("location: index.php");
        } else {
            $error = "Gebruikersnaam en/of wachtwoord is fout!";
        }
        $connection->close();
    }
}