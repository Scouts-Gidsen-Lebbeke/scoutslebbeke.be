let currentFocus = -1, controller = new AbortController();

function loadList(e) {
    controller.abort()
    controller = new AbortController()
    tokenized(`/api/user/findMember.php?query=${e.value}`, false, controller).then(d => {
        $("#member-list").empty();
        $("#member-id").val("").change();
        currentFocus = -1;
        d.forEach(m => {
            let option = $(`<div>${m.voornaam} ${m.achternaam}</div>`)
            option.on("click", () => {
                $("#member").val(`${m.voornaam} ${m.achternaam}`);
                $("#member-id").val(m.id).change();
                $("#member-list").empty();
            });
            $("#member-list").append(option);
        })
    }).catch(() => {})

}
function toggleSelection(e) {
    if (e.keyCode === 40) {
        addActive(1);
    } else if (e.keyCode === 38) {
        addActive(-1);
    } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1) {
            $(`#member-list div:eq(${currentFocus})`).click();
        }
    }
}

document.addEventListener("click", function (e) {
    let parent = document.getElementById("autocomplete-container")
    if (e.target !== parent && !parent.contains(e.target)) {
        $("#member-list").empty();
    }
});

function addActive(x) {
    if (currentFocus > -1) {
        $(`#member-list div:eq(${currentFocus})`).toggleClass("autocomplete-active")
    }
    const len = $("#member-list div").length
    currentFocus = (currentFocus + x + len) % len
    $(`#member-list div:eq(${currentFocus})`).toggleClass("autocomplete-active")
}