function fetchProfile() {
    return fetch(`https://groepsadmin.scoutsengidsenvlaanderen.be/groepsadmin/rest-ga/lid/profiel`, {
        headers: new Headers({ 'Authorization': `Bearer ${kc.token}` })
    }).then(response => response.json())
}

function loadProfile() {
    fetchProfile().then(d =>  {
        console.log(d)
        //$('#profile-name').text(d["gebruikersnaam"])
        //$('.visible-on-login').show()
    })
}

function loadProfileData() {
    fetchProfile().then(d => {
        $("#profile-full-name").text(d['vgagegevens']['voornaam'] + " " + d['vgagegevens']['achternaam'])
        $("#profile-username").text(d['gebruikersnaam'])
        $("#profile-functions").text(d['functies'].filter(f => !f['einde'] && f['code'] && f['groep'] === 'O3401G').map(f => f['omschrijving']).join(', '))
        $("#profile-address").text(d['adressen'][0]['straat'] + " " + d['adressen'][0]['nummer'] + ", " + d['adressen'][0]['gemeente'])
        $("#profile-email").text(d['email'])
        $("#profile-mobile").text(d['persoonsgegevens']['gsm'])
    })
}