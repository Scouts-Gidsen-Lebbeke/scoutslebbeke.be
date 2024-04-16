<?php
require 'getInternalLogin.php';

function getSubscriptionState($user): stdClass {
    global $connection;
    $result = new stdClass();
    try {
        $activity_id = $_GET['id'];
        if (strtotime("$user->med_date+1 year") < time()) {
            throw new InvalidArgumentException("Jouw medische fiche is al meer dan een jaar niet aangevuld, 
            update deze eerst in de <a href='https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/frontend/lid/individuelesteekkaart/$user->sgl_id' target='_blank' style='color: red'>Groepsadministratie</a>!");
        }
        $result->registration = mysqli_fetch_object($connection->query("select * from event_registration where user_id = '$user->id' and event_id = '$activity_id' and payment_id is not null and status not in ('canceled', 'expired', 'failed') order by date desc limit 1"));
        if ($result->registration == null) {
            $activity = mysqli_fetch_object($connection->query("select * from activity where id = '$activity_id'"));
            if ($activity == null) {
                throw new InvalidArgumentException("Er liep iets mis bij het vinden van de activiteit, probeer later opnieuw!");
            }
            $result->activity = $activity;
            if (strtotime($activity->close_subscription) < time() && !$user->level->isStaff()) {
                throw new InvalidArgumentException("De inschrijvingen voor deze activiteit zijn gesloten!");
            }
            if (strtotime($activity->open_subscription) > time() && !$user->level->isAdmin()) {
                $result->open_subscription = $activity->open_subscription;
            }
            if ($user->branch == null) {
                throw new InvalidArgumentException("Je hebt geen actieve tak, kijk jouw inschrijvingsgeld na!");
            }
            $activity_restrictions = mysqli_all_objects($connection, "select * from activity_restriction where activity_id = '$activity->id' and branch_id = '$user->branch'");
            if (empty($activity_restrictions)) {
                throw new InvalidArgumentException("Deze activiteit is niet voor jouw tak!");
            }
            foreach ($activity_restrictions as $option) {
                $option->price = getPrice($option, $activity, $user);
            }
            $result->options = $activity_restrictions;
        }
    } catch (Exception $e) {
        $result->error = $e->getMessage();
    }
    return $result;
}

function getPrice($activity_restriction, $activity, $user) {
    $base_price = $activity_restriction->alter_price ?? $activity->price;
    return $user->som ? ceil($base_price / 3) : $base_price;
}
