<?php
require '../getInternalLogin.php';
require '../init_mail.php';

$result = new stdClass();
try {
    $external_id = $_GET["external_id"];
    $function_id = $_GET["function"];
    $external_user = fetchSglUserById($external_id);
    $function = findFirstMatching($external_user->functions, fn($f) => $f->functie == $function_id && empty($f->einde));
    if (!empty($function)) {
        throw new InvalidArgumentException("De functie die je wil toekennen bestaat al!");
    }
    $data = [
        "functies" => [
            [
                "groep" => $organization->id,
                "functie" => $function_id,
                "begin" => date('Y-m-d'),
            ]
        ]
    ];
    postToAPI("/lid/$external_id?bevestig=true", $data);
} catch (Exception $e) {
    $result->error = $e->getMessage();
}
echo(json_encode($result));
