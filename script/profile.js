let kc;

async function toggleProfile() {
    if (await loadKeycloak()) {
        load('profile');
    } else {
        toggleLogin();
    }
}

async function loadKeycloak() {
    kc = new Keycloak("/script/keycloak.json")
    return kc.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' });
}

async function checkLogin() {
    const authenticated = await loadKeycloak();
    if (authenticated) {
        loadProfile()
    }
}

function toggleLogin() {
    kc.login({ redirectUri: document.location })
}

function fetchProfile() {
    return tokenized("/api/getLogin.php")
}

function loadProfile() {
    fetchProfile().then(d => {
        $('#profile-name').text(d.first_name)
        $('#profile-pic').css("background-image", "url(/images/profile/" + d.image + ")")
    })
}

async function loadProfileData() {
    await loadKeycloak()
    fetchProfile().then(d => {
        $("#profile-full-name").text(d.first_name + " " + d.name)
        $("#profile-username").text(d.member_id)
        $("#profile-functions").text(d.roles.map(f => f.name).join(', '))
        $("#profile-email").text(d.email)
        $("#profile-mobile").text(d.birth_date)
    });
}

async function tokenized(url) {
    await kc.updateToken(30)
    return fetch(url, {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` })
    }).then(data => data.json())
}