<?php
include '../getInternalLogin.php';

$result = new stdClass();
try {
    guardAdmin();
    $staff_functions = mysqli_all_columns($connection, "select sgl_id from role inner join branch on branch.id = role.staff_branch_id");
    $data = array(
        "naam" => "(Oud)leiding",
        "type" => "groep",
        "groep" => $organization->id,
        "kolommen" => [
            "be.vvksm.groepsadmin.model.column.VoornaamColumn" // doesn't comply with docs and should be present :(
        ],
        "criteria" => [
            "functies" => $staff_functions,
            "groepen" => [$organization->id],
        ],
        "delen" => false
    );
    $staff_ids = fetchFilterResultIds($data);
    if (!$connection->query("truncate table staff")) {
        throw new RuntimeException("Unable to clear staff table!");
    }
    if (!$connection->query("truncate table staff_branch")) {
        throw new RuntimeException("Unable to clear staff_branch table!");
    }
    foreach ($staff_ids as $sgl_id) {
        $user = getUserBySglId($sgl_id);
        $kbijnaam = !empty($user->kbijnaam) ? "'$user->kbijnaam'" : "NULL";
        $wbijnaam = !empty($user->wbijnaam) ? "'$user->wbijnaam'" : "NULL";
        $totem = !empty($user->totem) ? "'$user->totem'" : "NULL";
        $mobile = !empty($user->mobile) ? "'".normalizeMobile($user->mobile)."'" : "NULL";
        $global_branch_head = !empty(array_filter($user->roles, fn($r) => $r->sgl_id == $custom_fields->branch_head));
        mysqli_query($connection, "insert into staff values ($user->id, $kbijnaam, $wbijnaam, $totem, $mobile)");
        foreach ($user->roles as $role) {
            if (!empty($role->staff_branch_id)) {
                $branch = mysqli_fetch_object($connection->query("select * from branch where id = '$role->staff_branch_id'"));
                $branch_head = $global_branch_head && $branch->status === 'ACTIVE' ? 1 : 0;
                mysqli_query($connection, "insert into staff_branch values ($user->id, $role->staff_branch_id, $branch_head)");
            }
        }
    }
    $result->success = true;
} catch (Exception $e) {
    $result->success = false;
    $result->message = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);
