<?php
include '../getInternalLogin.php';

$result = new stdClass();
$result->unsynced = array();
try {
    $relevant_functions = mysqli_all_columns($connection, "select sgl_id from role inner join branch on branch.id = role.branch_id where branch.status in ('ACTIVE', 'MEMBER')");
    $data = array(
        "naam" => "Ingeschreven leden",
        "type" => "groep",
        "groep" => $organization->id,
        "kolommen" => [
            "be.vvksm.groepsadmin.model.column.VoornaamColumn",
            "be.vvksm.groepsadmin.model.column.AchternaamColumn",
            "be.vvksm.groepsadmin.model.column.VVKSMFunktiesColumn",
        ],
        "criteria" => [
            "functies" => $relevant_functions,
            "groepen" => [$organization->id],
        ],
        "delen" => false
    );
    $external_members = fetchFilterResult($data);
    $external_member_ids = array_values(array_map(fn($w) => $w->id, $external_members));
    $active_period = getActivePeriod();
    $members = mysqli_all_objects($connection, "select u.*, m.branch_id, b.name as branch_name, b.status as branch_status from membership m left join user u on m.user_id = u.id left join branch b on b.id = m.branch_id where m.period_id = $active_period->id");
    $member_external_ids = array_values(array_map(fn($w) => $w->sgl_id, $members));
    foreach ($members as $member) {
        if (empty($member->sgl_id)) {
            $member->type = "Ingeschreven als $member->branch_name, niet gekend in GA";
            $result->unsynced[] = $member;
        } else if (!in_array($member->sgl_id, $external_member_ids) && $member->branch_status != 'PASSIVE') {
            $member->type = "Ingeschreven als $member->branch_name, niet actief in GA";
            $result->unsynced[] = $member;
        }
    }
    foreach ($external_members as $external_member) {
        if (!in_array($external_member->id, $member_external_ids)) {
            $functions = $external_member->waarden->{"be.vvksm.groepsadmin.model.column.VVKSMFunktiesColumn"};
            $member = (object) array(
                "name" => $external_member->waarden->{"be.vvksm.groepsadmin.model.column.AchternaamColumn"},
                "first_name" => $external_member->waarden->{"be.vvksm.groepsadmin.model.column.VoornaamColumn"},
                "sgl_id" => $external_member->id,
                "type" => "Niet ingeschreven, $functions toegekend in GA"
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