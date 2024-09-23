let currentFocus = -1, controller = new AbortController();

function loadMemberList(e) {
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

function loadFunctionList(e) {
    controller.abort();
    controller = new AbortController();
    let searchField = $(e.target)
    tokenized(`/api/admin/findUnlinkedFunctions.php?query=${searchField.val()}`, false, controller).then(d => {
        let list = searchField.parent().find(`.function-list`)
        list.empty();
        let idField = searchField.parent().find(`.function-id`)
        idField.val("")
        currentFocus = -1;
        d.forEach(f => {
            let option = $(`<div>${f.name}</div>`)
            option.on("click", () => {
                searchField.val(`${f.name}`);
                idField.val(f.id)
                list.empty();
            });
            list.append(option);
        })
    }).catch(() => {})
}

function toggleFocus(e) {
    let list = $(e.target).parent().find('.autocomplete-items');
    if (e.keyCode === 40) {
        addActive(1, list);
    } else if (e.keyCode === 38) {
        addActive(-1, list);
    } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1) {
            list.find(`div:eq(${currentFocus})`).click();
        }
    }
}

function addClickListener() {
    $(document).on('click', function(e) {
        $('.autocomplete-items').each(function() {
            const list = $(this);
            const parent = list.parent();
            if (!list.is(e.target) && !list.has(e.target).length && !parent.is(e.target) && !parent.has(e.target).length) {
                list.empty();
            }
        });
    });
}

function addActive(x, listElement) {
    if (currentFocus > -1) {
        listElement.find(`div:eq(${currentFocus})`).toggleClass("autocomplete-active")
    }
    const len = listElement.find('div').length
    currentFocus = (currentFocus + x + len) % len
    listElement.find(`div:eq(${currentFocus})`).toggleClass("autocomplete-active")
}