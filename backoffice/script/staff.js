loadStaff();

function loadStaff() {
    fetch(new Request('/backoffice/api/getStaff.php', {method: 'GET'}))
        .then(response => response.json()).then(data => {
        if (data["success"]) {
            $.each(data["list"], function (i, item) {
                $('#staff-list').append($('<option>', {
                    value: item["username"],
                    text : item["Voornaam"] + " " + item["Achternaam"]
                }));
            });
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

}

function deleteStaff() {

}

function newStaff() {

}

function uploadStaffPicture() {

}