<?php
require 'getInternalLogin.php';
$user = getUser();
if (!empty($user)) {
    $user->pages = array();
    if ($user->level->isScout()) {
        $user->pages[] = (object) [
            "name" => "Profiel",
            "path" => "profile/profile.html"
        ];
        $user->pages[] = (object) [
            "name" => "Mijn lidmaatschap",
            "path" => "profile/membership.html"
        ];
    }
    if ($user->level->isMember()) {
        $user->pages[] = (object) [
            "name" => "Mijn activiteiten",
            "path" => "profile/activities.html"
        ];
    }
    if ($user->level->isStaff()) {
        $user->pages[] = (object) [
            "name" => "Mijn portefeuille",
            "path" => "profile/wallet.html"
        ];
    }
    if ($user->level->isAdmin()) {
        $user->pages[] = (object) [
            "name" => "Beheer",
            "path" => "admin/admin.html"
        ];
    }
}
echo json_encode($user);
