<?php
session_start();
if (!isset($_SESSION['user'])) {
    session_destroy();
    echo json_encode(array("active" => false));
} else {
    echo json_encode(array("active" => true, "session" => $_SESSION));
}
