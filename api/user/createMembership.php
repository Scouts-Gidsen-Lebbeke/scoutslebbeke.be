<?php
require '../getInternalLogin.php';
require '../init_mollie.php';

$result = new stdClass();
try {
    $user = getCurrentUser(true);
    $member_id = $_GET['memberId'];
    if (!empty($member_id)) {
        if (!$user->level->isStaff()) {
            header("HTTP/1.1 401 Unauthorized");
            exit;
        }
        $member = getUserBySglId($member_id);
    } else {
        $member = $user;
    }
    $as_staff = $member->id != $user->id;
    if (!empty($user->branch) && $user->branch->status != 'PASSIVE') {
        if ($as_staff) {
            throw new InvalidArgumentException($member->first_name." is reeds ingeschreven voor dit werkingsjaar!");
        } else {
            throw new InvalidArgumentException("Je bent reeds ingeschreven voor dit werkingsjaar!");
        }
    }
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
        "redirectUrl" => $config["SERVER_URL"].$redirect,
        "webhookUrl" => $config["NGROK_URL"]."/api/user/updatePayment.php",
        "metadata" => [
            "period_id" => $active_period->id,
            "membership_id" => $membership_id,
            "branch_id" => $branch->id,
        ]
    ]);
    $connection->query("update membership set payment_id = '$payment->id' where id = '$membership_id'");
    $result->checkout = $payment->getCheckoutUrl();
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);

function double($d): string {
    return number_format($d, 2, '.', '');
}