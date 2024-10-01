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
        } else if (r.unsynced.length) {
            r.unsynced.forEach(m => {
                $("#unsynced-overview tbody").append(
                    `<tr id="unsynced-${m.sgl_id}">
                        <td>${m.first_name}</td>
                        <td>${m.name}</td>
                        <td>${m.type.description}</td>
                        <td class="icon-column">
                            ${!m.type.fix ? '' : `<img src="/images/wrench.png" class="subscription-icon" alt="fix" title="Los op" onclick="fixMember('${m.sgl_id}', '${m.type.confirm}', '${m.type.fix}')">` }
                        </td>
                        <td class="icon-column"><img src="/images/edit.png" class="subscription-icon" alt="edit" title="Pas dit lid aan" onclick="editMember('${m.sgl_id}')"></td>
                    </tr>`
                );
            })
            $("#unsynced-count").html(`(${r.unsynced.length})`)
        } else {
            $("#unsynced-count").html("(geen)")
        }
        $("#unsynced-overview-loader").hide();
        $("#load-unsynced").prop('disabled', false);
    });
}

function fixMember(external_id, confirm_message, fix) {
    if (!confirm(confirm_message)) return;
    tokenized(`/api/admin/${fix}.php?external_id=${external_id}`).then(r => {
        if (r.error) {
            alert(r.error)
        } else {
            $(`#unsynced-${external_id}`).remove()
        }
    })
}

function editMember(id) {
    window.open(`https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/frontend/lid/${id}`, '_blank');
}