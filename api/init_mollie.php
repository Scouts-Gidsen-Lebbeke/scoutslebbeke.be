<?php
use Mollie\Api\MollieApiClient;
use Mollie\Api\Resources\Customer;

require_once 'init_env.php';
require_once __DIR__ . "/../vendor/autoload.php";

$mollie = new MollieApiClient();
$mollie->setApiKey($config["MOLLIE_KEY"]);

function getOrCreateCustomer($user): Customer {
    global $mollie, $connection;
    if (empty($user->customer_id)) {
        $customer = $mollie->customers->create([
            "name" => $user->first_name." ".$user->name,
            "email" => $user->email,
        ]);
        $connection->query("update user set customer_id = '$customer->id' where id = $user->id");
        $user->customer_id = $connection->insert_id;
        return $customer;
    }
    return $mollie->customers->get($user->customer_id);
}
