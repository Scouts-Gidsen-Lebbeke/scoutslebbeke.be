<?php
use Mollie\Api\MollieApiClient;

require_once 'init_env.php';
require_once __DIR__ . "/../vendor/autoload.php";

$mollie = new MollieApiClient();
$config = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/config.ini');
$mollie->setApiKey($config["MOLLIE_KEY"]);
