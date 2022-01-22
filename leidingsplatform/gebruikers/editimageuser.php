<?php include '../session.php'; ?>
<?php include "handlepicturechange.php"; ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Wijzig profielfoto</h1>
    <form action="" method="post" enctype="multipart/form-data">
        <p>Selecteer een afbeelding (enkel .jpg, .png of .jpeg, enkel bestanden kleiner dan 0,5 MB):</p>
        <input type="file" name="fileToUpload" id="fileToUpload"><br>
        <input type="submit" value="Upload afbeelding" name="submit">
        <input id="changepbutton" name="returntoprofile" type="button" onclick="location.href='gebruikers.php'" value="Annuleer">
        <span><?php echo $error15; ?></span>
    </form>
</div>
</body>
</html>