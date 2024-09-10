<?php
require 'RoleLevel.php';
require 'connect.php';
require 'user/init_membership.php';

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

function callAPI($path, $withExit = false) {
    $ch = curl_init("https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/".$path);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".getBearerToken()));
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

function postToAPI($path, $data): ?object {
    $jsonData = json_encode($data);
    $ch = curl_init("https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/".$path);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json",
        "Authorization: Bearer ".getBearerToken()
    ));
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

function fetchUserById($id): ?object {
    global $connection;
    $user = mysqli_fetch_object($connection->query("select * from user where id = '$id'"));
    $sgl_user = fetchSglUserById($user->sgl_id);
    if ($sgl_user == null) return null;
    return translateUser($sgl_user);
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

function translateUser($sgl_user): object {
    global $connection, $organization, $custom_fields;
    if (mysqli_num_rows($connection->query("select id from user where sgl_id = '$sgl_user->id'")) != 1) {
        $name = $sgl_user->vgagegevens->achternaam;
        $firstName = $sgl_user->vgagegevens->voornaam;
        mysqli_query($connection, "insert into user values (null, '$sgl_user->id', '$name', '$firstName', 'default.png')");
    }
    $user = mysqli_fetch_object($connection->query("select * from user where sgl_id = '$sgl_user->id'"));
    $user->email = $sgl_user->email;
    $user->mobile = normalizeMobile(@$sgl_user->persoonsgegevens->gsm);
    $user->birth_date = $sgl_user->vgagegevens->geboortedatum;
    $user->med_date = $sgl_user->vgagegevens->individueleSteekkaartdatumaangepast;
    fetchUserMedics($user);
    $user->member_id = $sgl_user->verbondsgegevens->lidnummer;
    $user->som = $sgl_user->vgagegevens->verminderdlidgeld;
    $user->nis_nr = getPrivateField($sgl_user->groepseigenVelden, $custom_fields->nis_nr);
    $user->address = $sgl_user->adressen[0];
    $functions = array_filter($sgl_user->functies, fn($func): bool => $func->groep == $organization->id && is_null($func->einde ?? null));
    $user->roles = array();
    foreach ($functions as $sglf) {
        $role = mysqli_fetch_object($connection->query("select * from role where sgl_id = '$sglf->functie'"));
        if (!is_null($role)) {
            $user->roles[] = $role;
        }
    }
    $user->level = highest_level(array_map(fn ($r): int => $r->level, $user->roles));
    // A user should at all time only have assigned a single valid branch
    $user->branch = getActiveBranch($user->id);
    $user->staff_branch = null;
    if ($user->level->isStaff()) {
        $user->staff_branch = array_values(array_filter($user->roles, fn($r) => $r->staff_branch_id != null))[0]->id;
    }
    return $user;
}

function getPrivateField($list, $id): ?string {
    global $organization;
    return @get_object_vars(get_object_vars($list)[$organization->id]->waarden)[$id];
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