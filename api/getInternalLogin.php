<?php
require 'RoleLevel.php';
require 'settings.php';
require 'init_membership.php';

function getAuthorizationHeader(): ?string {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } else if (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    return $headers;
}
function getBearerToken(): ?string {
    $headers = getAuthorizationHeader();
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}

function callAPI($path, $withExit = false, $token = true) {
    global $GA_API;
    $ch = curl_init($GA_API.$path);
    if ($token) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".getBearerToken()));
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = json_decode(curl_exec($ch));
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http_code === "401" && $withExit) {
        header("HTTP/1.1 401 Unauthorized");
        exit;
    }
    return $result;
}

function postToAPI($path, $data, $patch = false, $token = true): ?object {
    global $GA_API;
    $jsonData = json_encode($data);
    $ch = curl_init($GA_API.$path);
    if ($patch) {
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
    } else {
        curl_setopt($ch, CURLOPT_POST, 1);
    }
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    if ($token) {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "Authorization: Bearer ".getBearerToken()
        ));
    } else {
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json"
        ));
    }
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $result = json_decode(curl_exec($ch));
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($http_code === "401") {
        header("HTTP/1.1 401 Unauthorized");
        exit;
    }
    return $result;
}

function fetchCurrentSglUser($withExit): ?object {
    return callAPI("lid/profiel", $withExit);
}

function fetchSglUserById($id): ?object {
    return callAPI("lid/".$id, true);
}

function fetchUserMedics($user): object {
    $medics = callAPI("lid/".$user->sgl_id."/steekkaart", true);
    // SGL passes today when not filled in, sigh
    if (empty(@$medics->gegevens->waarden->d5f75e1e463a56ef01463cec788d0002)) {
        $user->med_date = null;
    }
    if ($user->med_date) {
        $user->no_picture = @$medics->gegevens->waarden->d5f75e1e463384de014639190ebb00eb == "nee";
        $user->no_painkillers = @$medics->gegevens->waarden->d5f75e1e463384de0146390e395900e2 == "nee";
        $user->activity_restriction = @$medics->gegevens->waarden->GAVeld_202123_1236_35 == "ja";
        $user->family_remarks = sanitizeMedical(@$medics->gegevens->waarden->d5f75e1e4610ed0201461f026f8e0013);
        $user->food_anomalies = sanitizeMedical(@$medics->gegevens->waarden->d5f75e1e463384de0146391a3b4800ed);

        $user->takes_medication = @$medics->gegevens->waarden->d5f75e1e463384de01463901e13c00dc != "nee";
        $user->illnesses = sanitizeMedical(@$medics->gegevens->waarden->d5f75e1e463384de01463905280100de);
        $user->medical_attention = $user->takes_medication || !empty($user->illnesses);
    }
    return $user;
}

function sanitizeMedical($text): ?string {
    if (empty($text) || strcasecmp($text, "/") == 0 || strcasecmp($text, "nee") == 0 ||
        strcasecmp($text, "neen") == 0 ||strcasecmp($text, "geen") == 0 || strcasecmp($text, "nvt") == 0) {
        return null;
    }
    return $text;
}

function fetchUserById($id, $ref_date = null): ?object {
    global $connection;
    $user = mysqli_fetch_object($connection->query("select * from user where id = '$id'"));
    $sgl_user = fetchSglUserById($user->sgl_id);
    if ($sgl_user == null) return null;
    return translateUser($sgl_user, $ref_date);
}

function getCurrentUser($withExit = false): ?object {
    $sgl_user = fetchCurrentSglUser($withExit);
    if ($sgl_user == null) return null;
    return translateUser($sgl_user);
}

function getUserBySglId($id): ?object {
    $sgl_user = fetchSglUserById($id);
    if ($sgl_user == null) return null;
    return translateUser($sgl_user);
}

function translateUser($sgl_user, $ref_date = null): object {
    global $connection, $EXTERNAL_ORGANIZATION_ID;
    if (mysqli_num_rows($connection->query("select id from user where sgl_id = '$sgl_user->id'")) != 1) {
        $name = $sgl_user->vgagegevens->achternaam;
        $firstName = $sgl_user->vgagegevens->voornaam;
        mysqli_query($connection, "insert into user values (null, '$sgl_user->id', '$name', '$firstName', 'default.png', null)");
    }
    $user = mysqli_fetch_object($connection->query("select * from user where sgl_id = '$sgl_user->id'"));
    $user->email = $sgl_user->email;
    $user->mobile = normalizeMobile(@$sgl_user->persoonsgegevens->gsm);
    $user->birth_date = $sgl_user->vgagegevens->geboortedatum;
    $user->med_date = $sgl_user->vgagegevens->individueleSteekkaartdatumaangepast;
    fetchUserMedics($user);
    $user->member_id = $sgl_user->verbondsgegevens->lidnummer;
    $user->som = $sgl_user->vgagegevens->verminderdlidgeld;
    $user->totem = getPrivateField($sgl_user->groepseigenVelden, SettingId::CUSTOM_TOTEM->getValue());
    $user->kbijnaam = getPrivateField($sgl_user->groepseigenVelden, SettingId::CUSTOM_KBIJNAAM->getValue());
    $user->wbijnaam = getPrivateField($sgl_user->groepseigenVelden, SettingId::CUSTOM_WBIJNAAM->getValue());
    $user->nis_nr = getPrivateField($sgl_user->groepseigenVelden, SettingId::CUSTOM_NIS_NR->getValue());
    $user->address = $sgl_user->adressen[0];
    $user->roles = array();
    foreach ($sgl_user->functies as $function) {
        // Only functions from the configured organisation matter
        if ($function->groep != $EXTERNAL_ORGANIZATION_ID) continue;
        // If no reference date is given, only check the currently active functions
        if (empty($ref_date) && !empty(@$function->einde)) continue;
        // If a reference date is given, only check the functions present at reference date
        if (!empty($ref_date) && (strtotime($ref_date) < strtotime($function->begin) || (!empty(@$function->einde) && strtotime($ref_date) > strtotime(@$function->einde)))) continue;
        $role = mysqli_fetch_object($connection->query("select * from role where sgl_id = '$function->functie'"));
        // Only configured functions matter
        if (!is_null($role)) {
            $user->roles[] = $role;
        }
    }
    $user->level = highest_level(array_map(fn ($r): int => $r->level, $user->roles));
    // A user should at all time only have assigned a single valid membership
    $user->branch = getActiveBranch($user->id, $ref_date);
    // If no membership is found (either active or at reference date), try matching a passive branch (not requiring a membership)
    if (empty($user->branch)) {
        foreach (array_filter($user->roles, fn($r) => $r->branch_id != null) as $role) {
            $user->branch = mysqli_fetch_object($connection->query("select * from branch where id = '$role->branch_id' and status = 'PASSIVE'"));
            if (!empty($user->branch)) break;
        }
    }
    $user->staff_branch = null;
    if ($user->level->isStaff()) {
        $staff_branches = array_values(array_filter($user->roles, fn($r) => $r->staff_branch_id != null));
        if (!empty($staff_branches)) { // admins don't necessarily have a staff branch
            $user->staff_branch = $staff_branches[0]->staff_branch_id;
        }
    }
    return $user;
}

function getPrivateField($list, $id): ?string {
    global $EXTERNAL_ORGANIZATION_ID;
    return @get_object_vars(get_object_vars($list)[$EXTERNAL_ORGANIZATION_ID]->waarden)[$id];
}

function normalizeMobile($mobile): ?string {
    if ($mobile == null) return null;
    $mobile = preg_replace("/[^0-9]/", "", trim($mobile));
    if (strlen($mobile) == 10) {
        return "+32".substr($mobile, 1);
    }
    if (strlen($mobile) == 11) {
        return "+".$mobile;
    }
    return null;
}

function guardStaff(): object {
    $user = getCurrentUser(true);
    if (!$user->level->isStaff()) {
        header("HTTP/1.1 401 Unauthorized");
        exit;
    }
    return $user;
}

function guardAdmin(): object {
    $user = getCurrentUser(true);
    if (!$user->level->isAdmin()) {
        header("HTTP/1.1 401 Unauthorized");
        exit;
    }
    return $user;
}

function fetchFilterResult($filter): array {
    $filter_result = postToAPI("/ledenlijst/filter", $filter);
    if ($filter_result->id != null) {
        callAPI("/ledenlijst/filter/".$filter_result->id);
    }
    $partial_external_result = callAPI("/ledenlijst");
    $external_result = $partial_external_result->leden;
    $offset = $partial_external_result->aantal;
    while ($offset < $partial_external_result->totaal) {
        $partial_external_result = callAPI("/ledenlijst?offset=".$offset);
        $external_result = array_merge($external_result, $partial_external_result->leden);
        $offset += $partial_external_result->aantal;
    }
    return $external_result;
}

function fetchFilterResultIds($filter): array {
    return array_values(array_map(fn($w) => $w->id, fetchFilterResult($filter)));
}

function findFirstMatching(array $arr, callable $predicate) {
    foreach ($arr as $item) {
        if ($predicate($item)) {
            return $item;
        }
    }
    return null;
}

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

function fetchOrganization(string $type): ?object {
    global $connection;
    $organization = mysqli_fetch_object($connection->query("select * from organization where type = '$type'"));
    if (!empty($organization)) {
        $organization->address = mysqli_fetch_object($connection->query("select * from location where id = $organization->location_id"));
        $organization->contacts = mysqli_all_objects($connection, "select * from organization_contact where organization_id = $organization->id");
        $email_contacts = array_filter($organization->contacts, fn($c) => $c->type === "EMAIL");
        $organization->email = reset($email_contacts)->value;
        $delegate_id = SettingId::DELEGATE_ID->getValue();
        if (!empty($delegate_id)) {
            $delegate_id = intval($delegate_id);
            $organization->delegate = mysqli_fetch_object($connection->query("select * from user where id = $delegate_id"));
            $organization->delegate->role = SettingId::DELEGATE_ROLE->getValue();
        }
    }
    return $organization;
}

function fetchOwner(): ?object {
    return fetchOrganization('OWNER');
}