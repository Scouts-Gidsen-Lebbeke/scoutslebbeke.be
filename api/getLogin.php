<?php
require 'getInternalLogin.php';
$user = getCurrentUser();
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
        $user->pages[] = (object) [
            "name" => "Mijn activiteiten",
            "path" => "profile/activities.html"
        ];
    }
    if ($user->level->isStaff()) {
        $user->pages[] = (object) [
            "name" => "Mijn leden",
            "path" => "staff/members.html"
        ];
        //$user->pages[] = (object) [
        //    "name" => "Mijn portefeuille",
        //    "path" => "profile/wallet.html"
        //];
    }
    if ($user->level->isAdmin()) {
        $user->pages[] = (object) [
            "name" => "Ledenbeheer",
            "path" => "admin/member.html"
        ];
        $user->pages[] = (object) [
            "name" => "Activiteitenbeheer",
            "path" => "admin/activity.html"
        ];
        $user->pages[] = (object) [
            "name" => "Evenementenbeheer",
            "path" => "admin/event.html"
        ];
        $user->pages[] = (object) [
            "name" => "Organisatiebeheer",
            "path" => "admin/organisation.html"
        ];
        $user->pages[] = (object) [
            "name" => "Sitebeheer",
            "path" => "admin/admin.html"
        ];
    }
}
echo json_encode($user);
