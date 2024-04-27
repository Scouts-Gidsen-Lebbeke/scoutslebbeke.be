<?php
require "../getInternalLogin.php";
guardStaff();
$result = new stdClass();
try {
    $id = $_POST['id'];
    $calendar_id = $_POST['calendar'];
    $title = $_POST['title'];
    if (empty($title)) {
        throw new InvalidArgumentException("Een titel is verplicht!");
    }
    $from = $_POST['from'];
    if (empty($from)) {
        throw new InvalidArgumentException("Een startdatum is verplicht!");
    }
    $to = $_POST['to'];
    if (empty($to)) {
        throw new InvalidArgumentException("Een einddatum is verplicht!");
    }
    if (strtotime($from) > strtotime($to)) {
        throw new InvalidArgumentException("De startdatum mag niet voor de einddatum liggen!");
    }
    $location = $_POST['location'];
    $location = !empty($location) ? "'$location'" : "NULL";
    $closed = @$_POST['closed'] == 'on';
    $content = $_POST['content'];
    $image = $_POST['image'];
    $image = !empty($image) ? "'$image'" : "NULL";
    if (empty($content)) {
        throw new InvalidArgumentException("De inhoud is verplicht!");
    }
    if ($id) {
        $result->succes = mysqli_query($connection, "update calendar_item set fromDate = '$from', toDate = '$to', title = '$title', content = '$content', closed = '$closed', location_id = $location, image = $image where id='$id'");
    } else {
        $result->succes = mysqli_query($connection, "insert into calendar_item values (null, '$from', '$to', '$title', '$content', null, null, '$calendar_id', '$closed', $image, $location)");
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);