<?php
include '../getInternalLogin.php';

$result = new stdClass();
try {
    $name = validate("last_name", "achternaam");
    $first_name = validate("first_name", "voornaam");
    // TODO: if I finally get SGV to create service accounts, I can poll them (in case the user hasn't previously been synced).
    $existing = mysqli_fetch_column($connection->query("select count(*) from user where lower(name) = lower('$name') and lower(first_name) = lower('$first_name')"));
    if ($existing > 0) {
        throw new InvalidArgumentException("Er bestaat al een lid met deze naam, neem contact op indien u de gebruikersnaam bent vergeten.");
    }
    $birthdate = validate("birthdate", "geboortedatum");
    $gender = validate("gender", "gender");
    $email = validate("email", "e-mailadres");
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException("Het opgegeven e-mailadres is niet geldig!");
    }
    $mobile = validate("mobile", "telefoonnummer");
    $address = translatePlace(validate("place_id", "adres"));
    $reduced = @$_POST['reduced'] == 'on';
    $data = [
        "groepsnummer" => $organization->id,
        "persoonsgegevens" => [
            "geslacht" => $gender,
            "gsm" => $mobile,
            "verminderdlidgeld" => $reduced,
        ],
        "voornaam" => $first_name, // again not conform the API docs
        "achternaam" => $name,
        "geboortedatum" => $birthdate,
        "email" => $email,
        "adres" => [
            "land" => $address->country,
            "postcode" => $address->zip,
            "gemeente" => $address->town,
            "straat" => $address->street,
            "nummer" => $address->number,
            "bus" => $address->addition,
            "postadres" => true,
            "status" => "normaal"
        ],
    ];
    $res = postToAPI("/lid/aanvraag", $data, false, false);
    if (@$res->titel == 'Fout') {
        throw new InvalidArgumentException($res->beschrijving);
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);

function validate($name, $translation): string {
    global $connection;
    $param = mysqli_real_escape_string($connection, $_POST[$name]);
    if (empty($param)) {
        throw new InvalidArgumentException("Een $translation is verplicht!");
    }
    return $param;
}
