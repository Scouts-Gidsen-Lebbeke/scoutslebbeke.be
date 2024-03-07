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

function fetchSglUser($withExit): ?object {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: Bearer ".getBearerToken()));
    curl_setopt($ch, CURLOPT_URL, "https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/lid/profiel");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $sgl_user = json_decode(curl_exec($ch));
    curl_close($ch);
    if (is_null($sgl_user) && $withExit) {
        header("HTTP/1.1 401 Unauthorized");
        exit;
    }
    return $sgl_user;
}

function fetchUser($sgl_id): ?object {
    global $connection;
    if ($sgl_id == null) return null;
    $user = mysqli_fetch_object($connection->query("select * from user where sgl_id = '$sgl_id'"));
    $user->roles = fetchRoles($user->id);
    $user->level = highest_level(array_map(fn ($r): int => $r->level, $user->roles));
    // A user should at all time only have assigned a single valid branch
    $temp = array_values(array_filter($user->roles, fn($r) => $r->branch_id != null));
    $user->branch = $temp[0]->branch_id;
    return $user;
}

function getUser($withExit = false, $forceUpdate = false): ?object {
    $sgl_user = fetchSglUser($withExit);
    if ($sgl_user == null) return null;
    if ($forceUpdate || !userExists($sgl_user->id)) {
        return updateUser($sgl_user);
    }
    return fetchUser($sgl_user->id);
}

function userExists($sgl_id): bool{
    global $connection;
    return mysqli_num_rows($connection->query("select id from user where sgl_id = '$sgl_id'")) == 1;
}

function fetchRoles($id): array {
    global $connection;
    return mysqli_all_objects($connection, "select id, name, admin, branch_id, level from user_role left join role on role.id = user_role.role_id where user_id = '$id'");
}

function updateUser($sgl_user): object {
    global $connection;
    $sgl_id = $sgl_user->id;
    $name = $sgl_user->vgagegevens->achternaam;
    $firstName = $sgl_user->vgagegevens->voornaam;
    $email = $sgl_user->email;
    $mobile = normalizeMobile($sgl_user->persoonsgegevens->gsm);
    $birthdate = $sgl_user->vgagegevens->geboortedatum;
    // SGL passes today when not filled in, sigh
    $medDate = $sgl_user->vgagegevens->individueleSteekkaartdatumaangepast;
    $memberId = $sgl_user->verbondsgegevens->lidnummer;
    $som = $sgl_user->vgagegevens->verminderdlidgeld;
    //$nisFieldId = $sgl_user->groepseigenVelden->O3401G->schema[0]->id;
    //$adres = $sgl_user->adressen[0];
    if (mysqli_num_rows($connection->query("select id from user where sgl_id = '$sgl_id'")) != 1) {
        mysqli_query($connection, "insert into user values (null, '$sgl_id', '$memberId', '$name', '$firstName', '$birthdate', '$email', '$mobile', null, '$medDate', '$som', 'default.png')");
    } else {
        mysqli_query($connection, "update user set name = '$name', first_name = '$firstName', birth_date = '$birthdate', email = '$email', mobile = '$mobile', med_date = '$medDate' where sgl_id='$sgl_id'");
    }
    $user = fetchUser($sgl_user->id);
    $functions = array_map(fn($func): string => $func->functie, array_filter($sgl_user->functies, fn($func): bool => is_null($func->einde ?? null)));
    mysqli_query($connection, "delete from user_role where user_id='$user->id'");
    foreach ($functions as $sgl_func_id) {
        $func = mysqli_fetch_object($connection->query("select id from role where sgl_id = '$sgl_func_id'"));
        if (!is_null($func)) {
            mysqli_query($connection, "insert into user_role value ('$user->id', '$func->id')");
        }
    }
    return fetchUser($sgl_id);
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