<?php
include "restrictionLogic.php";

$result = new stdClass();
try {
    $json = json_decode($_POST['id']);
    $result->restrictions = parse_restrictions($json);
    $result->branches = lookupBranches($result->restrictions);
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
