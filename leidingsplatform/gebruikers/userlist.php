<?php
$result = '';
$userlistquery = mysqli_query($connection, "select Voornaam, Achternaam from profiel");
while ($user = mysqli_fetch_assoc($userlistquery)) {
    $result = $result.'<option>'.$user['Voornaam'].' '.$user['Achternaam'].'</option>';
}
echo $result;