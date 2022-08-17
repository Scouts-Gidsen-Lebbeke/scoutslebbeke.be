fetch("/backoffice/api/getSetting.php?q=staff_visible").then(res => res.json()).then(data => {
    $('input[name=value][value="' + data["setting_value"] + '"]').prop('checked',true)
});

function postStaffSetting() {
    const form = new FormData(document.querySelector('#staff-visibility'));
    fetch(new Request('/backoffice/api/postSetting.php?q=staff_visible', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            if (data["error"]) {
                $("#error-staff-visibility").html(data["message"])
            }
    });
}