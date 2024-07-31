<?php
require_once "../connect.php";


function lookupBranches($restrictions): array {
    global $connection;
    $branch_ids = array();
    $branches = array();
    foreach ($restrictions as $r) {
        if (!in_array($r->branch_id, $branch_ids)) {
            $branch_ids[] = $r->branch_id;
            $branches[] = mysqli_fetch_object($connection->query("select * from branch where id = '$r->branch_id'"));
        }
    }
    return $branches;
}

function parse_restrictions($json): ?array {
    if (empty($json)) {
        throw new InvalidArgumentException("Een activiteit moet minstens voor 1 groep zijn!");
    }
    $result = array();
    foreach ($json as $r) {
        $result[$r->branch_id][] = $r;
        if ($r->branch_id < 0) {
            throw new InvalidArgumentException("Specifieer een tak voor elke lijn!");
        }
        if ($r->alter_price && $r->alter_price < 0) {
            throw new InvalidArgumentException("De prijs kan niet negatief zijn!");
        }
        if ($r->alter_start && strtotime($r->alter_start) < time()) {
            throw new InvalidArgumentException("De startdatum mag niet in het verleden liggen!");
        }
        // TODO: check if the alternative end date isn't before the original start date
        if ($r->alter_start && $r->alter_end && strtotime($r->alter_start) > strtotime($r->alter_end)) {
            throw new InvalidArgumentException("De einddatum mag niet voor de startdatum liggen!");
        }
    }
    foreach ($result as $branch_group) {
        $unique_names = array_filter(array_unique(array_column($branch_group, 'name')));
        if (sizeof($branch_group) > 1 && sizeof($branch_group) != sizeof($unique_names)) {
            throw new InvalidArgumentException("Groepen met meerdere opties moeten een unieke naam hebben!");
        }
    }
    return $json;
}
