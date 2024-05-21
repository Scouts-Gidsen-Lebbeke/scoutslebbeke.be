<?php
require '../getInternalLogin.php';

function getSubscriptionState($member, $user): stdClass {
    global $connection;
    $as_staff = $member->id != $user->id;
    $result = new stdClass();
    try {
        $activity_id = $_GET['id'];
        if ($member->branch == null) {
            if ($as_staff) {
                throw new InvalidArgumentException($member->first_name." heeft geen actieve tak!");
            } else {
                throw new InvalidArgumentException("Je hebt geen actieve tak, kijk jouw inschrijvingsgeld na!");
            }
        }
        if (strtotime("$member->med_date+1 year") < time()) {
            if ($as_staff) {
                throw new InvalidArgumentException("De medische fiche van ".$member->first_name." is al meer dan een jaar niet aangevuld,
                    update deze eerst in de <a href='https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/frontend/lid/individuelesteekkaart/$member->sgl_id' target='_blank' style='color: red'>Groepsadministratie</a>!");
            } else {
                throw new InvalidArgumentException("Jouw medische fiche is al meer dan een jaar niet aangevuld, 
                    update deze eerst in de <a href='https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/frontend/lid/individuelesteekkaart/$member->sgl_id' target='_blank' style='color: red'>Groepsadministratie</a>!");
            }
        }
        $result->registration = mysqli_fetch_object($connection->query("select * from activity_registration where user_id = '$member->id' and activity_id = '$activity_id' and payment_id is not null and status not in ('canceled', 'expired', 'failed') order by date desc limit 1"));
        if ($result->registration == null) {
            $activity = mysqli_fetch_object($connection->query("select * from activity where id = '$activity_id'"));
            if ($activity == null) {
                throw new InvalidArgumentException("Er liep iets mis bij het vinden van de activiteit, probeer later opnieuw!");
            }
            $result->activity = $activity;
            if (strtotime($activity->close_subscription) < time() && !$user->level->isStaff()) {
                throw new InvalidArgumentException("De inschrijvingen voor deze activiteit zijn gesloten!");
            }
            if (strtotime($activity->open_subscription) > time() && !$user->level->isStaff()) {
                $result->open_subscription = $activity->open_subscription;
            }
            $activity_restrictions = mysqli_all_objects($connection, "select * from activity_restriction where activity_id = '$activity->id' and branch_id = '$member->branch'");
            if (empty($activity_restrictions)) {
                if ($as_staff) {
                    throw new InvalidArgumentException("Deze activiteit is niet voor ".$member->first_name." (".$member->branch.")!");
                } else {
                    throw new InvalidArgumentException("Deze activiteit is niet voor jouw tak!");
                }
            }
//            $siblings = mysqli_fetch_array($connection->query("select * from sibling_relation s inner join activity_registration r on s.user_id = '$member->id' or s.sibling_user_id = '$member->id' where r."))
            foreach ($activity_restrictions as $option) {
                $option->price = getPrice($option, $activity, $member);
            }
            $result->options = $activity_restrictions;
        } else if ($result->registration->status == "open") {
            if ($as_staff) {
                $result->registration->feedback = $member->first_name." is reeds ingeschreven voor deze activiteit, maar de betaling werd nog niet ontvangen. 
                    Nog bezig met de betaling? Werk ze <a onclick='finishPayment(\"".$result->registration->payment_id."\")'>hier</a> verder af.";
            } else {
                $result->registration->feedback = "Je bent reeds ingeschreven voor deze activiteit, maar de betaling werd nog niet ontvangen. 
                    Nog bezig met de betaling? Werk ze <a onclick='finishPayment(\"".$result->registration->payment_id."\")'>hier</a> verder af.";
            }
        } else if ($result->registration->status == "paid") {
            if ($as_staff) {
                $result->registration->feedback = $member->first_name." is reeds ingeschreven voor deze activiteit.";
            } else {
                $result->registration->feedback = "Je bent reeds ingeschreven voor deze activiteit.";
            }
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
