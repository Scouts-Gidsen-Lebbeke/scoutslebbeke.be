<?php
session_start();
if (!isset($_SESSION['login_user'])) {
    session_destroy();
    echo json_encode(array("active" => false));
} else {
    echo json_encode(array("active" => true, "user" => $_SESSION['login_user']));
}
