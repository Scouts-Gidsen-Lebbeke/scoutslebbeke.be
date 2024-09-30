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
            "be.vvksm.groepsadmin.model.column.GeboorteDatumColumn",
            "be.vvksm.groepsadmin.model.column.VVKSMTakkenColumn",
            "be.vvksm.groepsadmin.model.column.VVKSMLeeftijdsTakkenColumn",
        ],
        "criteria" => [
            "functies" => $relevant_functions,
            "groepen" => [$organization->id],
        ],
        "delen" => false
    );
    $external_members = fetchFilterResult($data);
    $active_period = getActivePeriod();
    $members = mysqli_all_objects($connection, "select u.*, m.branch_id, b.name as branch_name, b.status as branch_status from membership m left join user u on m.user_id = u.id left join branch b on b.id = m.branch_id where m.period_id = $active_period->id");
    $member_external_ids = array_values(array_map(fn($w) => $w->sgl_id, $members));
    foreach ($members as $member) {
        if (empty($member->sgl_id)) {
            $member->type = (object) array(
                "description" => "Ingeschreven als $member->branch_name, niet gekend in GA",
            );
            $result->unsynced[] = $member;
            continue;
        }
        $external_member = findFirstMatching($external_members, fn($m) => $m->id == $member->sgl_id);
        if (empty($external_member) && $member->branch_status != 'PASSIVE') {
            $member->type = (object) array(
                "description" => "Ingeschreven als $member->branch_name, niet actief in GA",
            );
            $result->unsynced[] = $member;
        } else if (!empty($external_member)) {
//            $birthdate = $external_member->waarden->{"be.vvksm.groepsadmin.model.column.GeboorteDatumColumn"};
//            $functions = $external_member->waarden->{"be.vvksm.groepsadmin.model.column.VVKSMFunktiesColumn"};
//            $valid_branch = findBranchForAge(DateTime::createFromFormat('d/m/Y', $birthdate), $active_period->end);
//            if ( != ) {
//                $member->type = "Ingeschreven als $member->branch_name, $functions toegekend in GA";
//                $result->unsynced[] = $member;
//            }
        }
    }
    foreach ($external_members as $external_member) {
        if (!in_array($external_member->id, $member_external_ids)) {
            $functions = $external_member->waarden->{"be.vvksm.groepsadmin.model.column.VVKSMFunktiesColumn"};
            $first_name = $external_member->waarden->{"be.vvksm.groepsadmin.model.column.VoornaamColumn"};
            $member = array(
                "name" => $external_member->waarden->{"be.vvksm.groepsadmin.model.column.AchternaamColumn"},
                "first_name" => $first_name,
                "sgl_id" => $external_member->id,
                "type" => [
                    "description" => "Niet ingeschreven, $functions toegekend in GA",
                    "confirm" => "Weet je zeker dat je de actieve functies van $first_name wil verwijderen in de GA?",
                    "fix" => "endExternalFunction"
                ]
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