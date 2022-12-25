<?php
function getAuthorizationHeader(){
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
function getBearerToken() {
    $headers = getAuthorizationHeader();
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}
$ch = curl_init();
curl_setopt($ch, CURLOPT_HTTPHEADER, array($authorization = "Authorization: Bearer ".getBearerToken()));
curl_setopt($ch, CURLOPT_URL, "https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/lid/profiel");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = json_decode(curl_exec($ch));
curl_close($ch);
if (is_null($result->id)) {
    header("HTTP/1.1 401 Unauthorized");
    exit;
}
echo $result;