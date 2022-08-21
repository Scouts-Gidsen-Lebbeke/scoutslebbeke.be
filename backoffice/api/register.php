<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password2 = $_POST['password-repeat'];
    if (empty($password) || empty($password2) || empty($username) || empty($email)) {
        throw new RuntimeException("Vul alle velden in!");
    }
    if (strcmp($password, $password2) !== 0) {
        throw new RuntimeException("Wachtwoorden komen niet overeen!");
    }
    if (strlen($password) < 8 || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[a-z]/', $password)) {
        throw new RuntimeException("Wachtwoord voldoet niet aan de voorwaarden!");
    }
    $query = $connection->query("select * from login where profile='$username'");
    if (mysqli_num_rows($query) == 1) {
        throw new RuntimeException("Gebruiker reeds gekend!");
    }
    $query2 = $connection->query("select * from profiel where username='$username' and email='$email'");
    if (mysqli_num_rows($query2) != 1) {
        throw new RuntimeException("Gebruiker niet gekend!");
    }
    $user_info = $query2->fetch_array(MYSQLI_ASSOC);
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    mysqli_query($connection, "insert into login value ('$username', '$password_hash', 'default.png', 0, '$username')");
    if (mysqli_affected_rows($connection) != 1) {
        throw new RuntimeException("Er ging iets fout, probeer later opnieuw!");
    }
    session_start();
    $_SESSION['user'] = $username;
    $_SESSION['user_first_name'] = $user_info["Voornaam"];
    $_SESSION['user_name'] = $user_info["Achternaam"];
    $_SESSION['user_profile_pic'] = 'default.png';
    $_SESSION['user_admin'] = 0;
    echo json_encode(array("success" => true, "message" => "Gebruiker succesvol geregistreerd!"));
} catch (RuntimeException $e) {
    echo json_encode(array("success" => false, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
