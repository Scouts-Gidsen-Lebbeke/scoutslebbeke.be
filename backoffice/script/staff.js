loadStaff();

function loadStaff() {
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
                $('#staff-username').val(username);
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
        });
    } else {
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
    const form = new FormData(document.querySelector('#staff-data'));
    fetch(new Request('/backoffice/api/postStaff.php', {method: 'POST', body: form}))
        .then(response => {console.log(response); return response.json();}).then(data => {
            $('#error-staff-data').html(data["message"]);
    });
}

function deleteStaff() {

}

function newStaff() {

}

function uploadStaffPicture() {

}