<?php
require 'init_subscription.php';

$user = getCurrentUser(true);
$registrations = mysqli_all_objects($connection, "select r.id, a.name, a.close_subscription, r.date, r.price, r.status, r.present from activity_registration r left join activity a on a.id = r.activity_id where r.user_id='$user->id' and r.status not in ('expired', 'failed')");
foreach ($registrations as $registration) {
    $registration->cancellable = $registration->status == "paid" && strtotime($registration->close_subscription) > time() && !$registration->present;
    $registration->status = translateStatus($registration->status);
}
echo json_encode($registrations);
$connection->close();

function translateStatus($s): ?string{
    return match ($s) {
        "paid" => "Betaald",
        "canceled" => "Geannuleerd",
        "open" => "In verwerking",
        default => null,
    };
}
