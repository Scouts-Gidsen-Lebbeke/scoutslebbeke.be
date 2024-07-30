<?php
require "../connect.php";


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
    return array();
}
