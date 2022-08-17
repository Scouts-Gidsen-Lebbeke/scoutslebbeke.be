loadStaff();

function resetAndChangeMessage(message) {
    const error = $('#error-staff-data')
    error.html(message)
    setTimeout(() => error.html(""), 2000);
}

function loadStaff(selection = null) {
    const filter = $('#filter-active-staff').prop("checked");
    fetch(new Request('/backoffice/api/getStaff.php?q=' + filter, {method: 'GET'}))
        .then(response => response.json()).then(data => {
        if (data["success"]) {
            const selector = $('#staff-list');
            selector.empty();
            selector.append($('<option>', {value: "", text : "Nieuw"}));
            $.each(data["list"], function (i, item) {
                selector.append($('<option>', {
                    value: item["username"],
                    text : item["Voornaam"] + " " + item["Achternaam"]
                }));
            });
            selector.val(selection)
            selector.trigger("change");
        }
    });
}

function updateStaffInfo() {
    const username = $('#staff-list').val();
    $("#delete-staff").prop("disabled", !username);
    $("#new-staff-pic").prop("disabled", !username);
    if (username) {
        fetch(new Request('/backoffice/api/getStaffDetail.php?q=' + username, {method: 'GET'}))
            .then(response => response.json()).then(res => {
            if (res["success"]) {
                const data = res["data"];
                $("#staff-pic-div").show();
                $('#staff-username').val(username);
                $('#staff-pic-name').val(data["Foto"]);
                $('#staff-firstname').val(data["Voornaam"]);
                $('#staff-lastname').val(data["Achternaam"]);
                $('#staff-nickname-1').val(data["kapoenenbijnaam"]);
                $('#staff-nickname-2').val(data["welpenbijnaam"]);
                $('#staff-totem').val(data["Totem"]);
                $('#staff-mobile').val(data["Gsm"]);
                $('#staff-pic').attr("src", "/images/profile/" + data["Foto"]);
                $('#staff-function').val(data["Functie"]);
                $('#staff-email').val(data["email"]);
                $('#branch-head').prop("checked", data["Takleiding"] === "1");
                $('#staff-head').prop("checked", data["Groepsleiding"] === "1");
                $('#uniform-master').prop("checked", data["uniform"] === "1");
            }
            resetAndChangeMessage(res["message"])
        });
    } else {
        $("#staff-pic-div").hide();
        $('#staff-username').val(null);
        $('#staff-firstname').val(null);
        $('#staff-lastname').val(null);
        $('#staff-nickname-1').val(null);
        $('#staff-nickname-2').val(null);
        $('#staff-totem').val(null);
        $('#staff-mobile').val(null);
        $('#staff-pic').attr("src", "/images/profile/default.png");
        $('#staff-function').val("Geen");
        $('#staff-email').val(null);
        $('#branch-head').prop("checked", false);
        $('#staff-head').prop("checked", false);
        $('#uniform-master').prop("checked", false);
    }
}

function saveStaff() {
    const form = new FormData(document.getElementById('staff-data'));
    fetch(new Request('/backoffice/api/postStaff.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            if (!$('#staff-list').val() && data["success"]) {
                $('#staff-username').val(data["user"]);
                loadStaff(data["user"])
            }
            resetAndChangeMessage(data["message"])
    });
}

function deleteStaff() {
    const form = new FormData(document.getElementById('staff-data'));
    fetch(new Request('/backoffice/api/deleteStaff.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            if (data["success"]) {
                loadStaff()
            }
            resetAndChangeMessage(data["message"])
    });
}

function uploadStaffPicture() {
    const form = new FormData(document.getElementById('staff-data'));
    fetch(new Request('/backoffice/api/postStaffImage.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            if (data["success"]) {
                $('#staff-pic-name').val(data["new"]);
                $('#staff-pic').attr("src", "/images/profile/" + data["new"]);
            } else {
                resetAndChangeMessage(data["message"])
            }
    });
}