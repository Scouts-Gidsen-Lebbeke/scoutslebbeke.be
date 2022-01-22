<?php
// handle content change
if (isset($_POST['savefilecontent'])) {
    $select = $_POST['filepath'];
    $pointer = fopen($select, 'w+');
    if ($pointer !== false) {
        $string = $_POST['pagecontent'];
        fwrite($pointer, $string);
        fclose($pointer);
    } else {
        $error8 = 'Aanpassing mislukt!';
    }
}
// handle file selection
function getfile($name){
    if (strcmp($name,'Credits')==0){
        return 'credits.html';
    } else if (strcmp($name,'Navigatiebalk')==0){
        return 'nav.html';
    } else if (strcmp($name,'Mobiele navigatiebalk')==0){
        return 'mobilenav.html';
    } else if (strcmp($name,'Meta-index')==0){
        return 'index.html';
    } else {
        return 'shared.js';
    }
}
if (isset($_POST['setFile'])) {
    $file = getfile($_POST['fileList']);
    $selected = '../../'.$file;
}