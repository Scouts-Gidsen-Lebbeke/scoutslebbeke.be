window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        loadProfile(d);
    });
};