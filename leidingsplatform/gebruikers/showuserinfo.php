<?php
$hoofd = $hoofd == 1 ? 'ja' : 'nee';
$takleiding = $takleiding == 1 ? 'ja' : 'nee';
echo '<img id="profilepic" src="../../images/'.$imagelink.'">
    <p>Voornaam: '.$voornaam.'</p>
    <p>Achternaam: '.$achternaam.'</p>
    <p>Bijnaam: '.$bijnaam.'</p>
    <p>Totem: '.$totem.'</p>
    <p>Gsm: '.$gsm.'</p>
    <p>E-mail: '.$email.'</p>
    <p>Functie: '.$functie.'</p>
    <p>Hoofdleiding: '.$hoofd.'</p>
    <p>Takleiding: '.$takleiding.'</p>';