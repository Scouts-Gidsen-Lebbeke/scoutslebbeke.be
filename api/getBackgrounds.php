<?php
$dir = $_SERVER['DOCUMENT_ROOT'] . '/images/background';
echo json_encode(array_map(fn($i) => '/images/background/' . $i, array_filter(scandir($dir), function($i) {
    global $dir;
    return $i !== ".." && $i !== "." && !is_dir($dir . $i);
})));