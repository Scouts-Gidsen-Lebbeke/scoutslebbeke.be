<?php
include '../getInternalLogin.php';

$result = new stdClass();
try {
    guardAdmin();
    $staff_functions = mysqli_all_columns($connection, "select sgl_id from branch left join role on branch.staff_role_id = role.id");
    $data = array(
        "naam" => "(Oud)leiding",
        "type" => "groep",
        "groep" => "O3401G",
        "kolommen" => [
            "be.vvksm.groepsadmin.model.column.VoornaamColumn" // doesn't comply with docs and should be present :(
        ],
        "criteria" => [
            "functies" => $staff_functions
        ],
        "delen" => false
    );
    $result = postToAPI("/ledenlijst/filter", $data);
    if ($result->id != null) {
        callAPI("/ledenlijst/filter/".$result->id);
    }
    $staff_result = callAPI("/ledenlijst");
    $staff_ids = array_values(array_map(fn($w) => $w->id, $staff_result->leden));
    $offset = $staff_result->aantal + $staff_result->offset;
    if ($offset < $staff_result->totaal) {
        $staff_result = callAPI("/ledenlijst?offset=".$offset);
        $staff_ids = array_merge($staff_ids, array_values(array_map(fn($w) => $w->id, $staff_result->leden)));
    }
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
        mysqli_query($connection, "insert into staff values ($user->id, $kbijnaam, $wbijnaam, $totem, '$user->branch_head', $mobile)");
        foreach ($user->roles as $role) {
            $branch = mysqli_fetch_object($connection->query("select * from branch where staff_role_id = '$role->id'"));
            if (!empty($branch)) {
                mysqli_query($connection, "insert into staff_branch values ($user->id, $branch->id)");
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
