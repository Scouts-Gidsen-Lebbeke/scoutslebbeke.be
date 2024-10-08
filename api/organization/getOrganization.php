<?php
include '../getInternalLogin.php';

echo json_encode(fetchOrCreateOwner());

function fetchOrCreateOwner() {
    global $connection, $EXTERNAL_ORGANIZATION_ID;
    $organization = fetchOwner();
    if (empty($organization)) {
        $external = callAPI("groep/$EXTERNAL_ORGANIZATION_ID", false, false);
        $description = $external->vrijeInfo;
        $address = $external->adressen[0];
        $address_description = $address->omschrijving ?? "lokaal";
        $addition = empty($address->bus) ? 'NULL' : "'$address->bus'";
        $zip = $address->postcode;
        $connection->query("insert into location values (null, '$address_description', '', '$address->straat', '$address->nummer', $addition, '$zip', '$address->gemeente', '$address->land', null)");
        $connection->query("insert into organization values (null, '$EXTERNAL_ORGANIZATION_ID', '$external->naam', 'OWNER', null, $connection->insert_id, 'scouting.png', '$description')");
        $id = $connection->insert_id;
        $email = $external->email;
        if (!empty($email)) {
            $connection->query("insert into organization_contact values ($id, 'EMAIL', '$email')");
        }
        $mobile = $address->telefoon;
        if (!empty($mobile)) {
            $connection->query("insert into organization_contact values ($id, 'MOBILE', '$mobile')");
        }
        $organization = fetchOwner();
    }
    return $organization;
}

function fetchOwner(): ?object {
    global $connection;
    $organization = mysqli_fetch_object($connection->query("select * from organization where type = 'OWNER'"));
    if (!empty($organization)) {
        $organization->address = mysqli_fetch_object($connection->query("select * from location where id = $organization->location_id"));
        $organization->contacts = mysqli_all_objects($connection, "select * from organization_contact where organization_id = $organization->id");
    }
    return $organization;
}
