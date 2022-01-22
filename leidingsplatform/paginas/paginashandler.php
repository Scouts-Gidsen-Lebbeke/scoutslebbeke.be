<?php
// handle content change
if (isset($_POST['savepagecontent'])) {
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
// handle page selection
function getdir($name){
    if (strcmp($name,'Over ons')==0||strcmp($name,'Inschrijven')==0||strcmp($name,'Uniform')==0||strcmp($name,'Missie')==0||strcmp($name,'Verhuur')==0||strcmp($name,'Nuttige links')==0){
        return 'info/';
    } else if (strcmp($name,'Kapoenen')==0||strcmp($name,'Welpen')==0||strcmp($name,'Jonggivers')==0||strcmp($name,'Givers')==0||strcmp($name,'Jins')==0||strcmp($name,'Leiding')==0){
        return 'takken/';
    } else if (strcmp($name,'Contact')==0){
        return 'contact/';
    } else if (strcmp($name, 'Sprokkel')==0){
        return 'sprokkel/';
    } else if (strcmp($name, 'Archief')==0){
        return 'fotos/';
    } else if (strcmp($name, 'Weekend')==0){
        return 'weekend/';
    } else if (strcmp($name, 'Kamp')==0){
        return 'kamp/';
    } else {
        return 'nieuwtjes/';
    }
}
if (isset($_POST['setPage'])) {
    $filewith = strtolower($_POST['pageList']);
    $filewith = str_replace(' ', '', $filewith);
    $filewith = $filewith.'.html';
    $dir = getdir($_POST['pageList']);
    $selected = '../../'.$dir.$filewith;
}