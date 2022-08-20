<?php
$dir = $_SERVER['DOCUMENT_ROOT'] . '/background';
echo json_encode(array_filter(scandir($dir), function($i) {
    global $dir;
    return !is_dir($dir . $i);
}));