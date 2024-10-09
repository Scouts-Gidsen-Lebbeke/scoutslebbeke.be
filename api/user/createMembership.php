<?php
require '../getInternalLogin.php';

$result = new stdClass();
try {
    $user = getCurrentUser(true);
    $member_id = $_GET['memberId'];
    if (!empty($member_id)) {
        if (!$user->level->isStaff()) {
            header("HTTP/1.1 401 Unauthorized");
            exit;
        }
        $member = getUserBySglId($member_id);
    } else {
        $member = $user;
    }
    $as_staff = $member->id != $user->id;
    if (!empty($user->branch) && $user->branch->status != 'PASSIVE') {
        if ($as_staff) {
            throw new InvalidArgumentException($member->first_name." is reeds ingeschreven voor dit werkingsjaar!");
        } else {
            throw new InvalidArgumentException("Je bent reeds ingeschreven voor dit werkingsjaar!");
        }
    }
    $result->checkout = createMembership($member, $as_staff);
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);