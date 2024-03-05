window.onload = function() {
    loadGlobal();
    checkLogin(loadProfile);
};

// noinspection JSUnusedGlobalSymbols (Google API dependency)
function initMap() {
    let address = {lat: 50.9841, lng: 4.144500};
    let map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: address
    });
    new google.maps.Marker({position: address, map: map});
}