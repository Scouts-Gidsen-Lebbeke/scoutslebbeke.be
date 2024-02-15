<?php
use Mollie\Api\MollieApiClient;

require_once 'init_env.php';
require_once __DIR__ . "/../vendor/autoload.php";

$mollie = new MollieApiClient();
$mollie->setApiKey($config["MOLLIE_KEY"]);
