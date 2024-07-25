window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        loadProfile(d);
        if (d.level < 4) {
            window.location = "/403.html";
        }
    });
};

function downloadCertificate() {
    getCertificate($("#subscription-id").val())
}

function syncStaff() {
    tokenized("/api/admin/syncStaff.php")
}