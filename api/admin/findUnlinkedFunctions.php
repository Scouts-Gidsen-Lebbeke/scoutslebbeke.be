<?php
include '../getInternalLogin.php';

$query = strtolower($_GET['query']);
$result = array();
if (!empty($query)) {
    $current_functions = mysqli_all_columns($connection, "select sgl_id from role");
    $all_functions = callAPI("/functie?groep=".$organization->id)->functies ?? array();
    foreach ($all_functions as $f) {
        if (str_contains(strtolower($f->beschrijving), $query) && !in_array($f->id, $current_functions)) {
            $result[] = (object) array(
                "id" => $f->id,
                "name" => $f->beschrijving,
                "code" => $f->code
            );
        }
    }
}
echo json_encode($result);