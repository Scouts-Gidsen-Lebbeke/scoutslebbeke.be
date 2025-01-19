window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        guardAdmin(d)
        loadProfile(d);
    });
};

let wrappers, wrapperIndex = 0;

function nextBackground() {

}

function deleteBackground() {

}

function addBackground() {

}