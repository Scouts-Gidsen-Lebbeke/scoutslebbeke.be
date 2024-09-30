<?php
require '../getInternalLogin.php';
require '../init_mail.php';

$result = new stdClass();
try {
    guardAdmin();
    $external_id = $_GET["external_id"];
    $external_user = fetchSglUserById($external_id);
    $active_functions = array_filter($external_user->functies, fn($f) => empty($f->einde));
    $all_roles = mysqli_all_columns($connection, "select sgl_id from role left join branch on role.branch_id = branch.id where (status is null or status != 'PASSIVE') and level != 4");
    $functions_to_end = array_filter($active_functions, fn ($f) => in_array($f->functie, $all_roles));
    if (empty($functions_to_end)) {
        throw new InvalidArgumentException("Dit lid heeft geen actieve functies!");
    }
    $data = new stdClass();
    $data->functies = array();
    foreach ($functions_to_end as $function) {
        $data->functies[] = [
            "groep" => $organization->id,
            "functie" => $function->functie,
            "begin" => $function->begin,
            "einde" => date('Y-m-d')
        ];
    }
    $res = postToAPI("/lid/$external_id?bevestig=true", $data, true);
    if (@$res->titel == 'Fout') {
        throw new InvalidArgumentException($res->beschrijving);
    }
    $mail = createMail();
    if ($debug) {
        $mail->addAddress($config["MAIL_FROM_ADDRESS"]);
    } else {
        $mail->addAddress($external_user->email);
    }
    $mail->addCC($config["MAIL_FROM_ADDRESS"]);
    $mail->isHTML();
    $mail->Subject = "Uitschrijving";
    $mail->Body = "
            <p>Dag {$external_user->vgagegevens->voornaam},</p>
            <p>
                We hebben jouw lidgeld voor dit werkingsjaar niet tijdig ontvangen en hebben jou bijgevolg uitgeschreven.
                Dit wil zeggen dat je niet meer verzekerd bent en dat je geen communicatie meer van ons 
                of Scouts & Gidsen Vlaanderen zal ontvangen.
            </p>
            <p>
                Wil je je toch nog opnieuw aansluiten, dan kan dit altijd door op onze website in te loggen
                en naar <a href='https://scoutslebbeke.be/profile/membership.html' target='_blank'>Mijn lidmaatschap</a>
                te gaan. Onderaan deze pagina vind je een knop 'Schrijf me in' die je bij de betaalpagina brengt. 
                Hierna ontvang je nog een bevestigingsmail.
            </p>
            <p>
                Ben je van mening dat er iets fout is gelopen, of heb je nog vragen, contacteer ons dan zeker!
            </p>
            <p>Stevige linker,<br/>
            De leiding</p>
            ";
    $mail->send();
} catch (Exception $e) {
    $result->error = $e->getMessage();
}
echo(json_encode($result));
