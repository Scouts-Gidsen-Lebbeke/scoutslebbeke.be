fetch("/backoffice/api/getSetting.php?q=sprokkel_period").then(res => res.json()).then(data => {
    $('input[name=value][value="' + data["setting_value"] + '"]').prop('checked',true)
});

function postSprokkelSetting() {
    const form = new FormData(document.querySelector('#sprokkel-period'));
    fetch(new Request('/backoffice/api/postSetting.php?q=sprokkel_period', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => {
            if (data["error"]) {
                console.log(data["message"]);
            }
    });
}

function postSprokkel() {
    const form = new FormData(document.querySelector('#sprokkel-data-upload'));
    fetch(new Request('/backoffice/api/postSprokkel.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error-sprokkel-upload').html(data["message"]));
}

function postCamp() {
    const form = new FormData(document.querySelector('#camp-data-upload'));
    fetch(new Request('/backoffice/api/postCamp.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error-camp-upload').html(data["message"]));
}

function postPrivacy() {
    const form = new FormData(document.querySelector('#privacy-data-upload'));
    fetch(new Request('/backoffice/api/postPrivacy.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error-privacy-upload').html(data["message"]));
}

function postBackground() {
    const form = new FormData(document.querySelector('#background-data-upload'));
    fetch(new Request('/backoffice/api/postBackground.php', {method: 'POST', body: form}))
        .then(response => response.json()).then(data => $('#error-background-upload').html(data["message"]));
}