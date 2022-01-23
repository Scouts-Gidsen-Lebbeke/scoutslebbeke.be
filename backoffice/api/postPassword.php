<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $oldpass = $_POST['oldpass'];
    $newpass = $_POST['newpass'];
    $newpass2 = $_POST['newpass2'];
    $username = $_SESSION['login_user'];
    if (empty($oldpass)) {
        throw new RuntimeException("Oud wachtwoord kan niet leeg zijn!");
    }
    if (empty($newpass) || empty($newpass2)) {
        throw new RuntimeException("Nieuw wachtwoord kan niet leeg zijn!");
    }
    if (!strcmp($newpass, $newpass2)) {
        throw new RuntimeException("Niewe wachtwoorden komen niet overeen!");
    }
    if (strlen($newpass) < 8 || !preg_match('/[A-Z]/', $newpass) || !preg_match('/[0-9]/', $newpass) || !preg_match('/[a-z]/', $newpass)) {
        throw new RuntimeException("Nieuw wachtwoord voldoet niet aan de voorwaarden!");
    }
    $query = $connection->query("select password from login where username='$username'");
    if (mysqli_num_rows($query) != 1 || !password_verify($oldpass, mysqli_fetch_assoc($query)['password'])) {
        throw new RuntimeException("Oud wachtwoord is niet correct!");
    }
    $newpass_hash = password_hash($newpass, PASSWORD_DEFAULT);
    mysqli_query($connection, "update login set password = '$newpass_hash' where username='$username'");
    if (mysqli_affected_rows($connection) != 1) {
        throw new RuntimeException("Er ging iets fout, probeer later opnieuw!");
    }
    echo json_encode(array("status" => "success", "error" => false, "message" => "Wachtwoord succesvol gewijzigd!"));
} catch (RuntimeException $e) {
    echo json_encode(array("status" => "error", "error" => true, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
