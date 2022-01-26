<?php
include $_SERVER['DOCUMENT_ROOT'] . '/api/connect.php';
$data = json_decode(file_get_contents('php://input'), true);
$table = $data['table'];
$f = fopen('php://memory', 'w');
$fields = $data['fields'];
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
