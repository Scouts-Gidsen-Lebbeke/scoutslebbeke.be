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