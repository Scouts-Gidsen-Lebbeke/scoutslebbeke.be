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

}