window.onload = function() {
    loadGlobal();
    addClickListener()
    requireLogin(function (d) {
        guardAdmin(d)
        loadProfile(d);
        loadMemberTasks();
    });
};

function syncStaff() {
    $("#sync-staff").prop("disabled", true);
    $("#sync-staff-feedback").html("Bezig met ophalen data...");
    tokenized("/api/admin/syncStaff.php").then(d => {
        $("#sync-staff-feedback").html(d.success ? "Synchronisatie gelukt!" : d.message)
        $("#sync-staff").prop("disabled", false);
    });
}

function loadMemberTasks() {
    $("#unsynced-overview tbody").empty()
    $("#unsynced-feedback").empty();
    $("#load-unsynced").prop('disabled', true);
    $("#unsynced-overview-loader").show();
    tokenized(`/api/admin/findUnsyncedMembers.php`).then(r => {
        if (r.error) {
            $("#unsynced-feedback").html(r.error)
        } else if (r.unsynced) {
            r.unsynced.forEach((m, i) => {
                $("#unsynced-overview tbody").append(
                    `<tr>
                        <td>${i + 1}</td>
                        <td>${m.first_name}</td>
                        <td>${m.name}</td>
                        <td>${m.type}</td>
                        <td class="icon-column"><img src="/images/edit.png" class="subscription-icon" alt="edit" title="Pas dit lid aan" onclick="editMember('${m.sgl_id}')"></td>
                    </tr>`
                );
            })
        } else {
            $("#unsynced-feedback").html("Alle leden zijn correct ingesteld!");
        }
        $("#unsynced-overview-loader").hide();
        $("#load-unsynced").prop('disabled', false);
    });
}

function editMember(id) {
    window.open(`https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/frontend/lid/${id}`, '_blank');
}