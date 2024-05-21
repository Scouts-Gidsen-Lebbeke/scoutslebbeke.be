<?php
require 'init_subscription.php';

$user = getUser(false, true);
$member = $user;
if ($_GET['memberId'] != $member->sgl_id) {
    guardStaff();
    $member = getUserById($_GET['memberId'], true);
}
if ($user == null) {
    echo json_encode(null);
} else {
    echo json_encode(getSubscriptionState($member, $user));
}
