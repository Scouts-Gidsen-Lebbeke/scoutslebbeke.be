<?php
$config = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/.env');
$EXTERNAL_ORGANIZATION_ID = $config["ORGANIZATION_ID"];
$debug = filter_var($config["APP_DEBUG"], FILTER_VALIDATE_BOOLEAN);
$APP_ENV = $config["APP_ENV"];
$GA_API = match ($APP_ENV) {
    "production" => "https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/",
    default => "https://ga-staging.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/",
};
if (!empty($config["EXPLICIT_GA_API"])) {
    $GA_API = $config["EXPLICIT_GA_API"];
}
