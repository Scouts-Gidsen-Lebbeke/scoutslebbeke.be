window.onload = function() {
    loadGlobal();
    checkLogin(loadProfile);
    const params = (new URL(document.location)).searchParams;
    getBranch(params.get('id'));
};

function getBranch(branchId) {
    $("#content").hide()
    fetch("/api/getBranch.php?id=" + branchId).then((res) => res.json()).then((d) => {
        $("#branch-name").text(d.name)
        $("#branch-logo").attr("src", "/images/branch/" + d.image);
        if (d.minimum_age === d.maximum_age) {
            $("#branch-age-gap").text(d.minimum_age)
        } else {
            $("#branch-age-gap").text(`${d.minimum_age} - ${ifNotNull(d.maximum_age, "...")}`)
        }
        $("#branch-description").html(d.description)
        $("#branch-law").html(d.law)
        getStaff(d)
        $("#content").show()
    });
}

function getStaff(data) {
    data.staff.forEach((staff) => {
        let nickname = "";
        if (staff.kapoenenbijnaam) {
            nickname += ' &bull; ' + staff.kapoenenbijnaam;
        }
        if (staff.welpenbijnaam) {
            nickname += ' &bull; ' + staff.welpenbijnaam;
        }
        const staffHead = staff.staffHead === '1' ? " (takleiding)" : '';
        $("#staff").append(
            `<div class='staff-item'>
                    <img src='/images/profile/${staff.image}' alt='${data.name} staff' class='staffPicture'/><br>
                    <b>Naam:</b> ${staff.first_name} ${staff.name}${nickname}${staffHead}<br>
                </div>`
        );
        // <b>Totem:</b> ${staff.Totem ? staff.Totem : "(geen)"}<br>
        // ${staffHead ? "<b>Gsm:</b> " + staff.mobile + "<br><b>E-mail:</b> " + data.email + "<br>" : ""}
    });
}

function getStam() {
    fetch("/api/getStaff.php?q=Stam").then((res) => res.json()).then((data) => {
        Object.values(data).forEach((item) => {
            $("#oldstaff").append(
                `<tr>
                    <td>${item["Voornaam"]} ${item["Achternaam"]}</td>
                    <td>${item["Totem"] ? item["Totem"] : "(geen)"}</td>
                </tr>`
            );
        });
    });
}