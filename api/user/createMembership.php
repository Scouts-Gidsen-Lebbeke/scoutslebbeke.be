<?php
require 'init_membership.php';
require '../init_mollie.php';

$result = new stdClass();
try {
    $user = getUser(true);
    if (!empty($_GET['memberId'])) {
        if (!$user->level->isStaff()) {
            header("HTTP/1.1 401 Unauthorized");
            exit;
        }
        $member = getUserById($_GET['memberId']);
    } else {
        $member = $user;
    }
    $as_staff = $member->id != $user->id;
    $active_period = getActivePeriod();
    $active_membership = mysqli_fetch_object($connection->query("select * from membership where period_id='$active_period->id' and status='paid'"));
    if (!empty($active_membership)) {
        if ($as_staff) {
            throw new InvalidArgumentException($member->first_name." is reeds ingeschreven voor dit werkingsjaar!");
        } else {
            throw new InvalidArgumentException("Je bent reeds ingeschreven voor dit werkingsjaar!");
        }
    }
    if ($as_staff) {
        $redirect = "/admin/staffMembership.html?memberId=".$member->sgl_id;
    } else {
        $redirect = "/profile/membership.html";
    }
    $price = $active_period->price;
    if ($member->som) {
        $price = ceil($price / 3);
    }
    $connection->query("insert into membership values (null, '$member->id', '$active_period->id', now(), 'open', null, $price)");
    $membership_id = $connection->insert_id;
    $payment = $mollie->payments->create([
        "amount" => [
            "currency" => "EUR",
            "value" => double($price)
        ],
        "description" => "Lidgeld ".date('Y', strtotime($active_period->start))."-".date('Y', strtotime($active_period->end)),
        "redirectUrl" => $config["SERVER_URL"].$redirect,
        "webhookUrl" => $config["NGROK_URL"]."/api/user/updatePayment.php",
        "metadata" => [
            "membership_id" => $membership_id,
            "member_id" => $member->id,
            "user_id" => $user->id
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

