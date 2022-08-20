fetch("/backoffice/api/getSetting.php?q=sprokkel_period").then(res => res.json()).then(data => {
    $('input[name=value][value="' + data["setting_value"] + '"]').prop('checked',true)
});

function postSprokkelSetting() {
    const form = new FormData(document.querySelector('#sprokkel-period'));
    fetch(new Request('/backoffice/api/postSetting.php?q=sprokkel_period', {method: 'POST', body: form}));
}

function postSprokkel() {
    const form = new FormData(document.querySelector('#sprokkel-data-upload'));
    fetch(new Request('/backoffice/api/postPdf.php?dir=%2Fuploads%2F&name=sprokkel', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => changeAndTimeout('#error-sprokkel-upload', data["message"]));
}

function postCamp() {
    const form = new FormData(document.querySelector('#camp-data-upload'));
    fetch(new Request('/backoffice/api/postPdf.php?dir=%2Fuploads%2F&name=camp', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => changeAndTimeout('#error-camp-upload', data["message"]));
}

function postPrivacy() {
    const form = new FormData(document.querySelector('#privacy-data-upload'));
    fetch(new Request('/backoffice/api/postPdf.php?dir=%2F&name=privacyverklaring', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => changeAndTimeout('#error-privacy-upload', data["message"]));
}

function postBackground() {
    const form = new FormData(document.querySelector('#background-data-upload'));
    fetch(new Request('/backoffice/api/postBackground.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error-background-upload').html(data["message"]));
}