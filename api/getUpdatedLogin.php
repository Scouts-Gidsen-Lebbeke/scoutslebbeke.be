<?php
require 'getInternalLogin.php';
echo json_encode(getUser(true, true));
