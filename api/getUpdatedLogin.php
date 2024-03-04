<?php
require 'getInternalLogin.php';
echo json_encode(updateUser(fetchSglUser(true)));
