<?php
include "restrictionLogic.php";

$result = new stdClass();
try {
    $json = json_decode(file_get_contents('php://input'));
    $result->restrictions = parse_restrictions($json);
    $result->branches = lookupBranches($result->restrictions);
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);
