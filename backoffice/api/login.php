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
    $query = $connection->query("select password, profile_picture, admin, profile from login where username='$username'");
    $row = mysqli_fetch_assoc($query);
    if (mysqli_num_rows($query) != 1 || !password_verify($password, $row['password'])) {
       throw new RuntimeException("Gebruikersnaam en/of wachtwoord is fout!");
    }
    $real_username = $row["profile"];
    $query2 = $connection->query("select * from staff where username='$real_username'");
    $user_info = $query2->fetch_array(MYSQLI_ASSOC);
    session_start();
    $_SESSION['user'] = $username;
    $_SESSION['user_first_name'] = $user_info["Voornaam"];
    $_SESSION['user_name'] = $user_info["Achternaam"];
    $_SESSION['user_profile_pic'] = $row['profile_picture'];
    $_SESSION['user_admin'] = $row['admin'];
    echo json_encode(array("status" => "success", "error" => false, "message" => "Inloggen succesvol!"));
} catch (RuntimeException $e) {
    echo json_encode(array("status" => "error", "error" => true, "message" => $e->getMessage()));
} finally {
    $connection->close();
}