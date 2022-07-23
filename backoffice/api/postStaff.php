<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
try {
    $username = $_POST['staff-username'];
    $firstname = $_POST['staff-firstname'];
    $lastname = $_POST['staff-lastname'];
    $nickname1 = $_POST['staff-nickname-1'];
    $nickname2 = $_POST['staff-nickname-2'];
    $totem = $_POST['staff-totem'];
    $mobile = $_POST['staff-mobile'];
    $email = $_POST['staff-email'];
    $function = $_POST['staff-function'];
    $branchHead = filter_var($_POST['branch-head'], FILTER_VALIDATE_BOOLEAN);
    $staffHead = filter_var($_POST['staff-head'], FILTER_VALIDATE_BOOLEAN);
    $uniformMaster = filter_var($_POST['uniform-master'], FILTER_VALIDATE_BOOLEAN);
    if (empty($firstname)) {
        throw new RuntimeException("Voornaam kan niet leeg zijn!");
    }
    if (empty($lastname)) {
        throw new RuntimeException("Achternaam kan niet leeg zijn!");
    }
    if (strcmp($function, "Stam") === 0 || strcmp($function, "Geen") === 0) {
        if ($branchHead) {
            throw new RuntimeException("Enkel actieve leiding kan takleiding zijn!");
        }
        if ($uniformMaster) {
            throw new RuntimeException("Enkel actieve leiding kan uniformverantwoordelijke zijn!");
        }
    }
    if (strcmp($function, "Stam") === 0 && $staffHead) {
        throw new RuntimeException("Enkel actieve leiding kan groepsleiding zijn!");
    }
    if (empty($username)) {
        $username = strtolower($firstname) . implode('', array_map(fn($v) => $v[0], explode(' ', strtolower($lastname))));
        if ($query = $connection->query("select * from profiel where username='$username'")) {
            if (mysqli_num_rows($query) !== 0) {
                $counter = 1;
                $username = $username . $counter;
                while ($query = $connection->query("select * from profiel where username='$username'")) {
                    if (mysqli_num_rows($query) === 0) {
                        break;
                    }
                    $counter++;
                    $username = substr($username, 0, strlen($username) - 1) . $counter;
                }
            }
        }
        if (!mysqli_query($connection, "insert into profiel values ('$username', '$firstname', '$lastname', '$nickname1', '$nickname2', '$totem', '$mobile', '$email', '$function', 'default.png', '$branchHead', '$staffHead', '$uniformMaster')")) {
            throw new RuntimeException("Er ging iets fout bij het aanmaken van de nieuwe leid(st)er, probeer later opnieuw!");
        }
    } else if (!mysqli_query($connection, "update profiel set Voornaam='$firstname', Achternaam='$lastname', kapoenenbijnaam='$nickname1', welpenbijnaam='$nickname2', Totem='$totem', Gsm='$mobile', email='$email', Functie='$function', Takleiding='$branchHead', Groepsleiding='$staffHead', uniform='$uniformMaster' where username='$username'")) {
        throw new RuntimeException("Er ging iets fout bij het updaten van de leid(st)er, probeer later opnieuw!");
    }
    echo json_encode(array("status" => "success", "error" => false, "message" => "De leid(st)er werd succesvol opgeslagen!"));
} catch (RuntimeException $e) {
    echo json_encode(array("status" => "error", "error" => true, "message" => $e->getMessage()));
} finally {
    $connection->close();
}
