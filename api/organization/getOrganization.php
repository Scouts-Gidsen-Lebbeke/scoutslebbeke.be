<?php
include '../getInternalLogin.php';

echo json_encode(fetchOrCreateOwner());
