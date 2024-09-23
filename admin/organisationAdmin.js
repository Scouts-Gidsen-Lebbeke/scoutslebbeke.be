let loadedBranches;

window.onload = function() {
    loadGlobal();
    addClickListener()
    let branches = loadBranches();
    requireLogin(async function (d) {
        guardAdmin(d)
        loadProfile(d);
        await branches;
        loadRoles();
    });
};

function loadBranches() {
    return fetch("/api/branch/getAll.php").then(r => r.json()).then(branches => {
        branches.forEach(b => {
            $('#branch-overview tbody').append(
                `<tr>
                    <td><a href="/branch/branch.html?id=${b.id}">${b.name}</a></td>
                    <td>${printPeriod(b)} jaar</td>
                    <td>${b.status}</td>
                    <td class="icon-column"><img src="/images/edit.png" class="subscription-icon" alt="edit" title="Bewerk deze tak" onclick="editBranch('${b.id}')"></td>
                </tr>`
            )
        })
        $("#branch-overview-loader").hide();
        loadedBranches = branches;
    });
}

function printPeriod(branch) {
    if (branch.minimum_age === branch.maximum_age) {
        return branch.minimum_age;
    }
    return branch.minimum_age + " - " + ifNotNull(branch.maximum_age, "...");
}

function loadRoles() {
    fetch("/api/admin/getAllRoles.php").then(r => r.json()).then(roles => {
        roles.forEach(addRole)
        $("#role-overview-loader").hide()
    });
}

function createBranch() {
    window.location = "/branch/editBranch.html?from=admin"
}

function editBranch(id) {
    window.location = `/branch/editBranch.html?id=${id}&from=admin`
}

function addRole(r) {
    let id = r ? r.id : "-1"
    $('#role-overview tbody').append(`
        <tr id="${id}">
            <td>
                <div class="autocomplete">
                    <input class="function-name" value="${r ? r.name : ""}" type="text" oninput="loadFunctionList(event)" onkeydown="toggleFocus(event);">
                    <div class="function-list autocomplete-items"></div>
                    <input class="function-id" type="text" value="${r ? r.id : ""}" hidden>
                </div>
            </td>
            <td>
                <select class="branch-list">
                    <option value="">(geen)</option>
                    ${loadedBranches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                </select>
            </td>
            <td>
                <select class="staff-branch-list">
                    <option value="">(geen)</option>
                    ${loadedBranches.map(b => `<option value="${b.id}">${b.name}</option>`).join('')}
                </select>
            </td>
            <td>
                <select class="level-list">
                    <option value="4">Admin</option>
                    <option value="3">Leiding</option>
                    <option value="2">Lid</option>
                    <option value="1">Ingelogde gebruiker</option>
                </select>
            </td>
            <td class="icon-column"><img src="/images/delete.png" class="subscription-icon" alt="delete" onclick="deleteRole(this)"></td>
            <td class="icon-column"><img src="/images/save.png" class="subscription-icon" alt="save" onclick="saveRole(this)"></td>
        </tr>
    `);
    if (r) {
        $('#role-overview .branch-list:last').val(r.branch_id);
        $('#role-overview .staff-branch-list:last').val(r.staff_branch_id);
        $('#role-overview .level-list:last').val(r.level);
    }
}

function saveRole(imgRef) {
    let row = $(imgRef.closest("tr"));
    let role = {};
    role['id'] = row.attr('id');
    role['name'] = row.find('.function-name').val();
    role['external_id'] = row.find('.function-id').val();
    role['branch_id'] = row.find('.branch-list').val();
    role['staff_branch_id'] = row.find('.staff-branch-list').val();
    role['level'] = row.find('.level-list').val();
    let data = JSON.stringify(role);
    fetch("/api/admin/saveRole.php", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${kc.token}`
        },
        body: data
    }).then(r => r.json()).then(r => {
        if (r.error) {
            alert(r.error)
        }
    })
}

function deleteRole(imgRef) {
    if (!confirm("Weet je zeker dat je deze rol wil verwijderen?")) return;
    let row = imgRef.closest("tr")
    if (row.id === "-1") {
        row.remove();
        return;
    }
    tokenized(`/api/admin/deleteRole.php?id=${row.id}`).then(r => {
        if (r.error) {
            alert(r.error)
        } else {
            row.remove()
        }
    })
}