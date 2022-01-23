<?php
session_start();
echo json_encode(array("logout" => session_destroy()));