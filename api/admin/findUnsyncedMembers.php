<?php
include '../getInternalLogin.php';

$result = new stdClass();
$result->unsynced = array();
try {
    $relevant_functions = mysqli_all_columns($connection, "select sgl_id from role inner join branch on branch.id = role.branch_id where branch.status in ('ACTIVE', 'MEMBER')");
    $data = array(
        "naam" => "(Oud)leiding",
        "type" => "groep",
        "groep" => $organization->id,
        "kolommen" => [
            "be.vvksm.groepsadmin.model.column.VoornaamColumn", // doesn't comply with docs and should be present :(
            "be.vvksm.groepsadmin.model.column.AchternaamColumn"
        ],
        "criteria" => [
            "functies" => $relevant_functions,
            "groepen" => [$organization->id],
        ],
        "delen" => false
    );
    $external_members = fetchFilterResult($data);
    $active_period = getActivePeriod();
    $members = mysqli_all_objects($connection, "select u.* from membership m left join user u on m.user_id = u.id where m.period_id = $active_period->id");
    $external_member_ids = array_values(array_map(fn($w) => $w->sgl_id, $members));
    foreach ($members as $member) {
        if (empty($member->sgl_id)) {
            $member->type = "Niet gekend in GA";
            $result->unsynced[] = $member;
        } else if (!in_array($member->sgl_id, $external_members)) {
            $member->type = "Niet actief in GA";
            $result->unsynced[] = $member;
        }
    }
    foreach ($external_members as $external_member) {
        if (!in_array($external_member, $external_member_ids)) {
            $member = (object) array(
                "name" => $external_member->waarden->{"be.vvksm.groepsadmin.model.column.AchternaamColumn"},
                "first_name" => $external_member->waarden->{"be.vvksm.groepsadmin.model.column.VoornaamColumn"},
                "type" => "Foutief actief in GA"
            );
            $result->unsynced[] = $member;
        }
    }
} catch (Exception $e) {
    $result->error = $e->getMessage();
} finally {
    $connection->close();
}
echo json_encode($result);