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
            "bus" => $address->box,
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

function translatePlace($place_id): object {
    global $config;
    $key = $config['MAPS_API_KEY'];
    $url = "https://maps.googleapis.com/maps/api/place/details/json?place_id=$place_id&key=$key";
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($curl);
    curl_close($curl);
    $placeDetails = json_decode($response, true);
    $addressData = new stdClass();
    if (isset($placeDetails['result']['address_components'])) {
        foreach ($placeDetails['result']['address_components'] as $component) {
            $types = $component['types'];
            if (in_array('route', $types)) {
                $addressData->street = $component['long_name'];
            }
            if (in_array('street_number', $types)) {
                $addressData->number = $component['long_name'];
            }
            if (in_array('subpremise', $types)) {
                $addressData->box = $component['long_name'];
            } else {
                $addressData->box = "";
            }
            if (in_array('locality', $types)) {
                $addressData->town = $component['long_name'];
            }
            if (in_array('postal_code', $types)) {
                $addressData->zip = $component['long_name'];
            }
            if (in_array('country', $types)) {
                $addressData->country = strtoupper($component['short_name']);
            }
        }
    } else {
        throw new InvalidArgumentException("Geen geldig adres!");
    }
    if (empty($addressData->street)) {
        throw new InvalidArgumentException("Een straatnaam is verplicht!");
    }
    if (empty($addressData->number)) {
        throw new InvalidArgumentException("Een huisnummer is verplicht!");
    }
    if (empty($addressData->town)) {
        throw new InvalidArgumentException("Een gemeente is verplicht!");
    }
    if (empty($addressData->zip)) {
        throw new InvalidArgumentException("Een postcode is verplicht!");
    }
    if (empty($addressData->country)) {
        throw new InvalidArgumentException("Een land is verplicht!");
    }
    return $addressData;
}
