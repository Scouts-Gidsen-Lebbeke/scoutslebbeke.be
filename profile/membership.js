window.onload = function() {
    loadGlobal();
    requireLogin(function (d) {
        loadProfile(d);
        loadMemberships();
    });
};

function loadMemberships() {
    tokenized("/user/getMemberships.php").then(result => {
        if (result.active) {
            $("#current-membership").show();
        } else {
            $("#no-current-membership").show();
        }
        result.history.forEach(membership =>
            $('#membership-overview tbody').append(`
                <tr>
                    <td>${membership.id}</td>
                    <td>${printY(membership.start)} - ${printY(membership.end)}</td>
                    <td>${membership.name}</td>
                    <td>${membership.date}</td>
                    <td>€ ${membership.price}</td>
                    <td class="icon-column"><img src="/images/report.png" class="subscription-icon" alt="report" onclick="getCertificate('${membership.id}')"></td>
                </tr>
            `)
        )
        $("#membership-loader").hide()
    });
}

function createMembership() {
    tokenized("/user/createMembership.php").then(result => {
        if (result.error) {
            alert(result.error)
        } else {
            location.href = result.checkout
        }
    })
}

function getCertificate(membershipId) {
    const template = fetch('/profile/certificates/membership.pdf').then(res => res.arrayBuffer())
    const signature = fetch('/profile/certificates/signature.png').then(res => res.arrayBuffer())
    tokenized(`/user/getCertificateData.php?id=${membershipId}`).then(async d => {
        const pdfDoc = await PDFLib.PDFDocument.load(await template)
        const form = pdfDoc.getForm()
        form.getTextField('name').setText(d.member.name)
        form.getTextField('first_name').setText(d.member.first_name)
        form.getTextField('birth_date').setText(printDDMMYYYY(new Date(Date.parse(d.member.birth_date))))
        form.getTextField('nis_nr').setText(ifNotNull(d.member.nis_nr, ""))
        form.getTextField('address').setText(`${d.member.address.straat} ${d.member.address.nummer}${d.member.address.bus != null ? " " + d.member.address.bus : ""}, ${d.member.address.postcode} ${d.member.address.gemeente}`)
        const period = printY(d.period.start) + " - " + printY(d.period.end)
        form.getTextField('membership_period').setText(period)
        form.getTextField('amount').setText(`€ ${d.membership.price}`)
        form.getTextField('payment_date').setText(printDDMMYYYY(new Date(Date.parse(d.membership.date))))
        form.getTextField('organization_name').setText(d.organization.name)
        form.getTextField('organization_address').setText(printAddress(d.organization.address))
        form.getTextField('organization_email').setText(d.organization.email)
        form.getTextField('signature_date').setText(printDDMMYYYY(new Date()))
        form.getTextField('signatory').setText(`${d.organization.delegate.first_name} ${d.organization.delegate.name}`)
        form.getTextField('id').setText(btoa(`${d.period.id}-#${d.membership.id}`))
        form.flatten()
        const page = pdfDoc.getPage(0)
        const pngImage = await pdfDoc.embedPng(await signature)
        const pngDims = pngImage.scale(0.1)
        page.drawImage(pngImage, {
            x: 70,
            y: 140,
            width: pngDims.width,
            height: pngDims.height,
        })
        const binary = await pdfDoc.save()
        download(binary, `Inschrijvingsbewijs ${period} - ${d.member.name} ${d.member.first_name}`, "application/pdf");
    })
}