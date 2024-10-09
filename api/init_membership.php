<?php
use Mollie\Api\Exceptions\ApiException;
require_once 'init_mollie.php';

function getActivePeriod() {
    global $connection;
    $active = mysqli_fetch_object($connection->query("select * from membership_period where now() between start and end"));
    if (empty($active)) {
        $last = mysqli_fetch_object($connection->query("select * from membership_period order by start desc limit 1"));
        if (empty($last)) {
            throw new RuntimeException("You forgot to configure a first period dumbass!");
        }
        $new_start = strtotime("$last->end+1 day");
        $new_end = date("Y-m-d", $new_start + strtotime($last->end) - strtotime($last->start));
        $new_start = date("Y-m-d", $new_start);
        $connection->query("insert into membership_period values (null, '$new_start', '$new_end', '$last->price')");
        return mysqli_fetch_object($connection->query("select * from membership_period where id = '$connection->insert_id'"));
    }
    return $active;
}

function getMembership($user_id, $ref_date): ?object {
    global $connection;
    if (empty($ref_date)) {
        $period_id = getActivePeriod()->id;
    } else {
        $period_id = mysqli_fetch_column($connection->query("select id from membership_period where '$ref_date' between start and end"));
    }
    return mysqli_fetch_object($connection->query("select * from membership where user_id='$user_id' and period_id='$period_id' and status = 'paid'"));
}

function getActiveBranch($user_id, $ref_date): ?object {
    global $connection;
    $membership = getMembership($user_id, $ref_date);
    if (!empty($membership)) {
        return mysqli_fetch_object($connection->query("select * from branch where id = '$membership->branch_id'"));
    }
    return null;
}

function findBranchForAge(DateTime $birth_date, string $period_end): object {
    global $connection;
    $lastDayOfPeriod = new DateTime($period_end);
    $lastDayOfPeriod->modify('last day of December this year');
    $lastDayOfPeriod->setTime(23, 59, 59);
    $ageAtEndOfPeriod = $birth_date->diff($lastDayOfPeriod)->y;
    return mysqli_fetch_object($connection->query("select * from branch where $ageAtEndOfPeriod >= minimum_age and (maximum_age is null or $ageAtEndOfPeriod <= maximum_age) and status != 'HIDDEN' order by status"));
}

function double($d): string {
    return number_format($d, 2, '.', '');
}

/**
 * @throws ApiException
 */
function createMembership(object $member, bool $as_staff): string {
    global $connection, $config;
    $active_period = getActivePeriod();
    $price = $active_period->price;
    if ($member->level->isStaff()) {
        $price = 43.90;
    } else if ($member->som) {
        $price = ceil($price / 3);
    }
    $branch = findBranchForAge(new DateTime($member->birth_date), $active_period->end);
    $connection->query("insert into membership values (null, '$member->id', '$active_period->id', $branch->id, now(), 'open', null, $price)");
    $membership_id = $connection->insert_id;
    $redirect = "/profile/membershipConfirmation.html?id=$membership_id&memberId=$member->sgl_id";
    if ($as_staff) {
        $redirect = $redirect."&as_staff=true";
    }
    $payment = getOrCreateCustomer($member)->createPayment([
        "amount" => [
            "currency" => "EUR",
            "value" => double($price)
        ],
        "description" => "Lidgeld ".$branch->name." ".date('Y', strtotime($active_period->start))."-".date('Y', strtotime($active_period->end)),
        "redirectUrl" => $config["APP_URL"].$redirect,
        "webhookUrl" => $config["APP_REMOTE_URL"]."/api/user/updatePayment.php",
        "metadata" => [
            "period_id" => $active_period->id,
            "membership_id" => $membership_id,
            "branch_id" => $branch->id,
        ]
    ]);
    $connection->query("update membership set payment_id = '$payment->id' where id = '$membership_id'");
    return $payment->getCheckoutUrl();
}
