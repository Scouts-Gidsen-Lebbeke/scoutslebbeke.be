<?php
session_start();
if (!isset($_SESSION['user'])) {
    session_destroy();
    echo json_encode(array("active" => false));
} else {
    echo json_encode(array("active" => true, "user" => $_SESSION['user'], "pic" => $_SESSION["user_profile_pic"]));
}
