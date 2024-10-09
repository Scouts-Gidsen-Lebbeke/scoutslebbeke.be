<?php
include '../getInternalLogin.php';

$result = new stdClass();
try {
    $name = validate("last_name", "achternaam");
    $first_name = validate("first_name", "voornaam");
    $birthdate = validate("birthdate", "geboortedatum");
    $gender = validate("gender", "gender");
    $email = validate("email", "e-mailadres");
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException("Het opgegeven e-mailadres is niet geldig!");
    }
    $mobile = validate("mobile", "telefoonnummer");
    $address = translatePlace(validate("place_id", "adres"));
    $reduced = @$_POST['reduced'] == 'on';

    // TODO: if I finally get SGV to create service accounts, I can poll them (in case the user hasn't previously been synced).
    $member = mysqli_fetch_object($connection->query("select * from user where lower(name) = lower('$name') and lower(first_name) = lower('$first_name')"));
    if (!empty($member)) {
        if (!empty($member->sgl_id)) {
            throw new InvalidArgumentException("Er bestaat al een lid met deze naam, neem contact op indien u de gebruikersnaam bent vergeten.");
        }
        $membership = mysqli_fetch_object($connection->query("select * from membership where user_id = $member->id"));
        if (empty($membership)) {
            throw new RuntimeException("Member #$member->id has an active request, but no linked membership!");
        }
        if ($membership->status === "open") {
            $result->checkout = $mollie->payments->get($membership->payment_id)->getCheckoutUrl();
        } else {
            $member->level = RoleLevel::GUEST;
            $member->birth_date = $birthdate;
            $member->som = $reduced;
            $member->email = $email;
            $result->checkout = createMembership($member, false);
        }
    } else {
        $data = [
            "groepsnummer" => $EXTERNAL_ORGANIZATION_ID,
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
        postToAPI("/lid/aanvraag", $data, false, false);
        $connection->query("insert into user values (null, null, '$name', '$first_name', 'default.png', null)");
        $member = mysqli_fetch_object($connection->query("select * from user where id = $connection->insert_id"));
        $member->level = RoleLevel::GUEST;
        $member->birth_date = $birthdate;
        $member->som = $reduced;
        $member->email = $email;
        $result->checkout = createMembership($member, false);
    }
} catch (RuntimeException $e) {
    header("HTTP/1.1 500 Internal server error");
    exit;
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
