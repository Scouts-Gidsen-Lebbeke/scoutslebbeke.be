<?php
include "../connect.php";
$result = array();
if ($query = $connection->query("select title, content, n.image, date, l.name, l.first_name from news n left join user l on n.user_id = l.id where visible order by date desc")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        array_push($result, $row);
    }
}
$query->close();
$connection->close();
echo json_encode($result);
