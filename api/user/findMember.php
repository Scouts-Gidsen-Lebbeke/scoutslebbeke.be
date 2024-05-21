<?php
include '../getInternalLogin.php';
$query = $_GET['query'];
if (empty($query)) {
    echo json_encode(array());
} else {
    $result = callAPI("zoeken?query=".$query);
    if (!empty($result)) {
        echo json_encode($result->leden);
    } else {
        echo json_encode(array());
    }
}

