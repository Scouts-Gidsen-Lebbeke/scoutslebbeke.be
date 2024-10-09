<?php
require_once 'init_env.php';

$connection = connect();

function connect(): mysqli {
    global $config;
    $connection = new mysqli($config["DB_HOST"], $config["DB_USERNAME"], $config["DB_PASSWORD"], $config["DB_DATABASE"]);
    mysqli_set_charset($connection, "utf8mb4");
    return $connection;
}

function mysqli_all_objects($connection, $query): array {
    $data = array();
    $result = $connection->query($query);
    while ($obj = mysqli_fetch_object($result)){
        $data[] = $obj;
    }
    $result->close();
    return $data;
}

function mysqli_all_columns($connection, $query): array {
    $data = array();
    $result = $connection->query($query);
    while ($obj = mysqli_fetch_column($result)){
        $data[] = $obj;
    }
    $result->close();
    return $data;
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
    $addressData->addition = null;
    $addressData->number = 0;
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
                $addressData->addition = $component['long_name'];
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
        $addressData->name = $placeDetails['result']['name'] ?? null;
        $addressData->url = $placeDetails['result']['url'] ?? null;
    } else {
        throw new InvalidArgumentException("Geen geldig adres!");
    }
    if (empty($addressData->street)) {
        throw new InvalidArgumentException("Een straatnaam is verplicht!");
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