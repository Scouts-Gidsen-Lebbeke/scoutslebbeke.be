let content

window.onload = function() {
    const q = (new URL(window.location.href)).searchParams.get('q');
    if (q) {
        window.history.replaceState(null, "", "/leidingsplatform/index.php");
    }
    const q2 = q ? q : localStorage.getItem("content");
    content = q2 ? q2 : 'home/home.html'
    $('#content').load(content)
};

window.onbeforeunload = function() {
    localStorage.setItem("content", content);
};

function load(page) {
    content = page + '/' + page + '.html';
    $('#content').load(content);
}

function loadUsers() {

}

function postSprokkel() {
    const form = new FormData(document.querySelector('#sprokkelData'));
    const request = new Request('sprokkel/sprokkelhandler.php', {method: 'POST', body: form});
    fetch(request).then(response => response.json()).then(data => $('#error').html(data["message"]));
}