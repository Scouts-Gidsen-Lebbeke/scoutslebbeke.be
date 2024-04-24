<?php
require 'getInternalLogin.php';
require 'uploads.php';

guardStaff();
echo json_encode(upload($_FILES['upfile'], $_GET['dir'], @$_GET['name']));