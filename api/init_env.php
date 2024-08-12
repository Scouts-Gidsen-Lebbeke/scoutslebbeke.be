<?php
$config = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . '/.env');
$organization = (object) array(
    "name" => $config["ORGANIZATION_NAME"],
    "street" => $config["ORGANIZATION_STREET"],
    "no" => $config["ORGANIZATION_NO"],
    "zip" => $config["ORGANIZATION_ZIP"],
    "town" => $config["ORGANIZATION_TOWN"],
    "address" => $config["ORGANIZATION_STREET"]." ".$config["ORGANIZATION_NO"].", ".$config["ORGANIZATION_ZIP"]." ".$config["ORGANIZATION_TOWN"],
    "email" => $config["ORGANIZATION_EMAIL"],
    "signatory" => $config["ORGANIZATION_SIGNATORY"],
    "signatory_role" => $config["ORGANIZATION_SIGNATORY_ROLE"],
    "id" => $config["ORGANIZATION_ID"]
);
$certifier = (object) array(
    "name" => $config["CERTIFIER_NAME"],
    "street" => $config["CERTIFIER_STREET"],
    "no" => $config["CERTIFIER_NO"],
    "zip" => $config["CERTIFIER_ZIP"],
    "town" => $config["CERTIFIER_TOWN"],
    "address" => $config["CERTIFIER_STREET"]." ".$config["CERTIFIER_NO"].", ".$config["CERTIFIER_ZIP"]." ".$config["CERTIFIER_TOWN"]
);
$custom_fields = (object) array(
    "totem" => $config["CUSTOM_TOTEM"],
    "kbijnaam" => $config["CUSTOM_KBIJNAAM"],
    "wbijnaam" => $config["CUSTOM_WBIJNAAM"],
    "nis_nr" => $config["CUSTOM_NIS_NR"],
    "branch_head" => $config["CUSTOM_BRANCH_HEAD"]
);
$debug = filter_var($config["APP_DEBUG"], FILTER_VALIDATE_BOOLEAN);
