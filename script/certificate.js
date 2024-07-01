async function getCertificate(subscriptionId) {
    // Fetch an existing PDF document
    const template = fetch('/profile/certificates/participation.pdf').then(res => res.arrayBuffer())
    const signature = fetch('/profile/certificates/signature.png').then(res => res.arrayBuffer())
    tokenized(`/api/activity/getCertificateData.php?id=${subscriptionId}`).then(async d => {
        if (!d) {
            alert("Geen deelnamebewijs gevonden voor deze inschrijving!");
            return;
        }
        const pdfDoc = await PDFLib.PDFDocument.load(await template)
        const form = pdfDoc.getForm()
        form.getTextField('name').setText(d.member.name)
        form.getTextField('first_name').setText(d.member.first_name)
        form.getTextField('birth_date').setText(printDDMMYYYY(new Date(Date.parse(d.member.birth_date))))
        form.getTextField('nis_nr').setText(ifNotNull(d.member.nis_nr, ""))
        form.getTextField('address').setText(`${d.member.address.straat} ${d.member.address.nummer}${d.member.address.bus != null ? " " + d.member.address.bus : ""}, ${d.member.address.postcode} ${d.member.address.bus.gemeente}`)
        form.getTextField('activity_name').setText(d.activity.name)
        form.getTextField('period').setText(`${printDDMMYYYY(new Date(Date.parse(d.registration.start)))} - ${printDDMMYYYY(new Date(Date.parse(d.registration.end)))}`)
        form.getTextField('days').setText(d.registration.days.toString())
        form.getTextField('amount').setText(`€ ${d.registration.price}`)
        form.getTextField('payment_date').setText(printDDMMYYYY(new Date(Date.parse(d.registration.date))))
        form.getTextField('organization_name').setText(d.organization.name)
        form.getTextField('organization_address').setText(d.organization.address)
        form.getTextField('organization_email').setText(d.organization.email)
        form.getTextField('signature_date').setText(printDDMMYYYY(new Date()))
        form.getTextField('signatory').setText(d.organization.signatory)
        form.getTextField('id').setText(btoa(`${d.activity.id}-#${d.registration.id}`))
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
        download(binary, `Deelnamebewijs ${d.activity.name} - ${d.member.name} ${d.member.first_name}`, "application/pdf");
    })
}

function printDDMMYYYY(date) {
    return date.toLocaleDateString('nl-BE', { year: 'numeric', month: '2-digit', day: '2-digit' });
}