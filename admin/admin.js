window.onload = function() {
    loadGlobal();
    getBackgrounds();
    requireLogin(function (d) {
        guardAdmin(d)
        loadProfile(d);
    });
};

let wrappers, wrapperIndex = 0;

function getBackgrounds() {
    fetch("/api/getBackgrounds.php").then(response => response.json()).then(data => {
        wrappers = Object.values(data);
        wrappers.forEach(url => {
            const img = new Image();
            img.src = url;
        })
        wrapperIndex = (wrapperIndex + 1) % wrappers.length;
        $("#background-wrapper").css("background-image", `url(${wrappers[wrapperIndex]})`);
    })
}

function nextBackground() {

}

function deleteBackground() {

}

function addBackground() {

}