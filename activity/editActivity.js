tinymce.init({
    selector: 'div#activity-pre-info',
    plugins: 'link code paste emoticons',
    toolbar: 'undo redo | bold italic underline strikethrough subscript superscript | forecolor | link emoticons | code',
    toolbar_mode: 'floating',
    menubar: false,
    paste_as_text: true,
    tinycomments_mode: 'embedded',
    height: 250,
    content_css: '/style/editor.css',
    automatic_uploads: false,
});

tinymce.init({
    selector: 'div#activity-pre-practical',
    plugins: 'link code paste emoticons',
    toolbar: 'undo redo | bold italic underline strikethrough subscript superscript | forecolor | link emoticons | code',
    toolbar_mode: 'floating',
    menubar: false,
    paste_as_text: true,
    tinycomments_mode: 'embedded',
    height: 250,
    content_css: '/style/editor.css',
    automatic_uploads: false,
});
window.addEventListener("load", initAutocomplete);

let jsonEditor, branches;
window.onload = function() {
    loadGlobal();
    retrieveLocations();
    initBranches();
    jsonEditor = CodeMirror.fromTextArea(document.getElementById("activity-additional-pre-form"), {
        mode: { name: "javascript", json: true },
        theme: "idea",
        lineNumbers: true
    });
    requireLogin(d => {
        guardStaff(d)
        loadProfile(d)
        retrieveActivity();
    });
};

function retrieveLocations() {
    fetch(`${baseApiUrl}/location/getAll.php`).then((res) => res.json()).then((locations) => {
        locations.forEach(b => $('#activity-location').append(`<option value="${b.id}">${b.name}</option>`))
    });
}

function initBranches() {
    fetch(`${baseApiUrl}/branch/getActive.php`).then((res) => res.json()).then((result) => { branches = result; });
}

function retrieveActivity() {
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    if (activityId == null) {
        $("#activity-loader").hide()
        $("#activity-form").show()
        return
    }
    tokenized(`/activity/getActivity.php?id=${activityId}`).then(a => {
        if (!params.get('duplicate')) {
            $("#activity-id").val(a.id)
        }
        $("#activity-name-input").val(a.name)
        $("#activity-from").val(a.start)
        $("#activity-to").val(a.end)
        $("#activity-open").val(a.open_subscription)
        $("#activity-closed").val(a.close_subscription)
        $("#activity-price").val(a.price)
        $("#activity-sibling-reduction").val(a.sibling_reduction)
        $("#activity-location").val(ifNotNull(a.location_id, 0))
        handleRestrictions(a.branches, a.restrictions)
        tinymce.get("activity-pre-info").setContent(a.info)
        if (a.practical_info) {
            tinymce.get("activity-pre-practical").setContent(a.practical_info)
        }
        if (a.additional_form) {
            jsonEditor.setValue(JSON.stringify(JSON.parse(a.additional_form), null, 2))
        }
        setTimeout(function() {
            jsonEditor.refresh();
        },1);
        $("#activity-additional-form-rule").val(a.additional_form_rule)
        $("#activity-loader").hide()
        $("#activity-form").show()
    })
}

function handleRestrictions(branches, restrictions) {
    $("#activity-branches").html(branches.map(b => `<img src="/images/branch/${b.image}" alt="${b.name}" title="${b.name}" class="branch-icon"/>`).join(""))
    $("#activity-restrictions").val(JSON.stringify(restrictions))
}

function editRestrictions() {
    let restrictions = [];
    if ($("#activity-restrictions").val()) {
        restrictions = JSON.parse($("#activity-restrictions").val())
    }
    $('#restriction-overview tbody').empty()
    restrictions.forEach(r => {
        $('#restriction-overview tbody').append(`
            <tr class=activity-restriction">
                <td>
                    <select class="branch-list">
                        ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}    
                    </select>
                </td>
                <td><input class="restriction-name" type="text" value="${ifNotNull(r.name)}"></td>
                <td><input class="restriction-start" type="datetime-local" value="${r.alter_start}"></td>
                <td><input class="restriction-end" type="datetime-local"  value="${r.alter_end}"></td>
                <td><input class="restriction-price" type="number" value="${r.alter_price}"></td>
                <td class="icon-column"><img src="/images/delete.png" class="subscription-icon" alt="delete" onclick="removeRestriction(this)"></td>
            </tr>
        `);
        $('#restriction-overview .branch-list:last').val(r.branch_id);
    });
    $("#restriction-dialog").css("display", "flex")
}

function saveAndCloseRestrictions() {
    let data = [];
    $('#restriction-overview tbody tr').each(function() {
        let rowData = {};
        rowData['branch_id'] = $(this).find('.branch-list').val();
        rowData['name'] = $(this).find('.restriction-name').val();
        rowData['alter_start'] = $(this).find('.restriction-start').val();
        rowData['alter_end'] = $(this).find('.restriction-end').val();
        rowData['alter_price'] = $(this).find('.restriction-price').val();
        data.push(rowData);
    });
    data = JSON.stringify(data);
    fetch(`${baseApiUrl}/activity/validateRestrictions.php`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: data
    }).then(r => r.json()).then(r => {
        if (r.error != null) {
            $("#restriction-form-feedback").html(r.error);
        } else {
            console.log(r.restrictions)
            handleRestrictions(r.branches, r.restrictions);
            closeRestrictionDialog();
        }
    });
}

function closeRestrictionDialog() {
    $("#restriction-form-feedback").empty();
    $("#restriction-dialog").hide()
}

function addRestriction() {
    $('#restriction-overview tbody').append(`
        <tr class=activity-restriction">
            <td>
                <select class="branch-list">
                    ${branches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}    
                </select>
            </td>
            <td><input class="restriction-name" type="text"></td>
            <td><input class="restriction-start" type="datetime-local"></td>
            <td><input class="restriction-send" type="datetime-local"></td>
            <td><input class="restriction-price" type="number"></td>
            <td class="icon-column"><img src="/images/delete.png" class="subscription-icon" alt="delete" onclick="removeRestriction(this)"></td>
        </tr>
    `);
}

function removeRestriction(imgRef) {
    imgRef.closest("tr").remove()
}

function postActivity() {
    $("#activity-info").val(tinymce.get("activity-pre-info").getContent());
    $("#activity-practical").val(tinymce.get("activity-pre-practical").getContent());
    $("#activity-additional-form").val(jsonEditor.getValue());
    postForm(`/activity/updateActivity.php`, "activity-form").then(result => {
        if (result.error != null) {
            $("#activity-form-feedback").html(result.error)
        } else {
            cancel()
        }
    });
}

function cancel() {
    const params = (new URL(document.location)).searchParams;
    const activityId = params.get('id')
    window.location = params.get('from') === "admin" ? "/admin/activity.html" : `/activity/activity.html?id=${activityId}`;
}