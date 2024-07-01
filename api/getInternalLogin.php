<?php
require 'RoleLevel.php';
require 'connect.php';

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
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".getBearerToken()));
    curl_setopt($ch, CURLOPT_URL, "https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/".$path);
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

function fetchCurrentSglUser($withExit): ?object {
    return callAPI("lid/profiel", $withExit);
}

function fetchSglUserById($id): ?object {
    return callAPI("lid/".$id, true);
}

function fetchUserMedics($id): ?object {
    return callAPI("lid/".$id."/steekkaart", true);
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
    global $connection, $organization;
    if (mysqli_num_rows($connection->query("select id from user where sgl_id = '$sgl_user->id'")) != 1) {
        $name = $sgl_user->vgagegevens->achternaam;
        $firstName = $sgl_user->vgagegevens->voornaam;
        mysqli_query($connection, "insert into user values (null, '$sgl_user->id', null, '$name', '$firstName', null, null, null, null, null, null, 'default.png')");
    }
    $user = mysqli_fetch_object($connection->query("select * from user where sgl_id = '$sgl_user->id'"));
    $user->email = $sgl_user->email;
    $user->mobile = normalizeMobile($sgl_user->persoonsgegevens->gsm);
    $user->birthdate = $sgl_user->vgagegevens->geboortedatum;
    $user->medDate = $sgl_user->vgagegevens->individueleSteekkaartdatumaangepast;
    // SGL passes today when not filled in, sigh
    if (strtotime("$user->medDate+5 seconds") > time()) {
        $user->medDate = null;
    }
    $user->memberId = $sgl_user->verbondsgegevens->lidnummer;
    $user->som = $sgl_user->vgagegevens->verminderdlidgeld;
    $user->nis_nr = getPrivateField($sgl_user->groepseigenVelden, "dc6fe7e5-edd6-45db-8fb0-ad783c769592");
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
    $branch_role = array_values(array_filter($user->roles, fn($r) => $r->branch_id != null));
    $user->branch = null;
    $user->staff_branch = null;
    if (!empty($branch_role)) {
        $user->branch = $branch_role[0]->branch_id;
        $branch_id = $branch_role[0]->id;
        $user->staff_branch = mysqli_fetch_column($connection->query("select id from branch where staff_role_id = '$branch_id'"));
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