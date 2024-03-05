window.onload = function() {
    loadGlobal();
    checkLogin(loadProfile);
    $('#min-year').text(new Date().getFullYear() - (new Date().getMonth() > 6 ? 6 : 7))
};