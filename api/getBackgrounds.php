<?php
$dir = $_SERVER['DOCUMENT_ROOT'] . '/background';
echo json_encode(array_filter(scandir($dir), function($i) {
    global $dir;
    return $i !== ".." && $i !== "." && !is_dir($dir . $i); // is_dir not working with webhost PHP version
}));