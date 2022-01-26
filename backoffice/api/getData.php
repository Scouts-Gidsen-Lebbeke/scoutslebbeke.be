<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$table = $_POST['table'];
$f = fopen('php://memory', 'w');
$fields = $_POST['fields'];
fputcsv($f, $fields);
if ($query = $connection->query("select * from `$table`")) {
    while($row = $query->fetch_assoc()){
        $lineData = array_map(fn($v): string => $row[$v], $fields);
        fputcsv($f, $lineData);
    }
}
$query->close();
$connection->close();
fseek($f, 0);
header('Content-Type: text/csv');
header('Content-Disposition: attachment; filename="' . $table . '.csv";');
fpassthru($f);
