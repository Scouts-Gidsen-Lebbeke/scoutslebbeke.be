<?php
include "connect.php";
$result = array();
if ($query = $connection->query("select * from news n left join login l on n.author = l.id where visible order by date desc")) {
    while ($row = $query->fetch_array(MYSQLI_ASSOC)) {
        array_push($result, $row);
    }
}
$query->close();
$connection->close();
echo json_encode($result);
