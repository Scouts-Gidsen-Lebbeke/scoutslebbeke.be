<?php
require_once "connect.php";

function getSetting(SettingId $id): ?string {
    global $connection;
    return mysqli_fetch_column($connection->query("select setting_value from settings where setting_id='$id->value'"));
}

function updateSetting(SettingId $id, object $value): bool {
    global $connection;
    return $connection->query("update settings set setting_value = '$value' where setting_id='$id->value'");
}

enum SettingId : string {
    case CUSTOM_BRANCH_HEAD = 'CUSTOM_BRANCH_HEAD';
    case CUSTOM_DEBTOR_NIS_NR = 'CUSTOM_DEBTOR_NIS_NR';
    case CUSTOM_DEBTOR_ROLE = 'CUSTOM_DEBTOR_ROLE';
    case CUSTOM_KBIJNAAM = 'CUSTOM_KBIJNAAM';
    case CUSTOM_NIS_NR = 'CUSTOM_NIS_NR';
    case CUSTOM_TOTEM = 'CUSTOM_TOTEM';
    case CUSTOM_WBIJNAAM = 'CUSTOM_WBIJNAAM';
    case DELEGATE_ID = 'DELEGATE_ID';
    case DELEGATE_ROLE = 'DELEGATE_ROLE';

    function getValue(): ?string {
        return getSetting($this);
    }

    function setValue(objec6t $value): bool {
        return updateSetting($this, $value);
    }
}