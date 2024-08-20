<?php
require "../getInternalLogin.php";
$user = guardStaff();
$result = new stdClass();
try {
    $id = $_POST['id'];
    $title = mysqli_real_escape_string($connection, $_POST['title']);
    if (empty($title)) {
        throw new InvalidArgumentException("Een titel is verplicht!");
    }
    $image = $_POST['image'];
    $image = !empty($image) ? "'$image'" : "NULL";
    $content = mysqli_real_escape_string($connection, $_POST['content']);
    if (empty($content)) {
        throw new InvalidArgumentException("De inhoud is verplicht!");
    }
    if ($id) {
        $result->succes = mysqli_query($connection, "update news set title = '$title', content = '$content', image = $image where id='$id'");
    } else {
        $result->succes = mysqli_query($connection, "insert into news values (null, '$user->id', '$title', '$content', $image, true, now())");
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);