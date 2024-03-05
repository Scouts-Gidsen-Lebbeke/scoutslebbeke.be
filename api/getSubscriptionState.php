<?php
require 'init_subscription.php';

$user = getUser(false, true);
if ($user == null) {
    echo json_encode(null);
} else {
    echo json_encode(getSubscriptionState($user));
}
