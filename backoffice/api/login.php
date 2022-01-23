<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $username = $_POST['username'];
    $password = $_POST['password'];
    if (empty($username)) {
        throw new RuntimeException("Gebruikersnaam kan niet leeg zijn!");
    }
    if (empty($password)) {
        throw new RuntimeException("Wachtwoord kan niet leeg zijn!");
    }
    $query = $connection->query("select password from login where username='$username'");
    if (mysqli_num_rows($query) != 1 || !password_verify($password, mysqli_fetch_assoc($query)['password'])) {
       throw new RuntimeException("Gebruikersnaam en/of wachtwoord is fout!");
    }
    session_start();
    $_SESSION['login_user'] = $username;
    echo json_encode(array("status" => "success", "error" => false, "message" => "Inloggen succesvol!"));
} catch (RuntimeException $e) {
    echo json_encode(array("status" => "error", "error" => true, "message" => $e->getMessage()));
} finally {
    $connection->close();
}