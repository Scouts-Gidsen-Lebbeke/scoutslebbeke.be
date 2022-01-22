<?php include '../session.php'; ?>
<?php include 'edituserhandler.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Wijzig profiel</h1>
    <form action="" method="post" id="profileform">
        <label>Voornaam:</label><br>
        <input id="profiledata" name="firstname" type="text" value="<?php echo $voornaam; ?>"><br>
        <label>Achternaam:</label><br>
        <input id="profiledata" name="lastname" type="text" value="<?php echo $achternaam; ?>"><br>
        <label>Bijnaam:</label><br>
        <input id="profiledata" name="nickname" type="text" value="<?php echo $bijnaam; ?>"><br>
        <label>Totem:</label><br>
        <input id="profiledata" name="totem" type="text" value="<?php echo $totem; ?>"><br>
        <label>Gsm:</label><br>
        <input id="profiledata" name="gsm" type="tel" value="<?php echo $row['Gsm']; ?>"><br>
        <label>E-mail:</label><br>
        <input id="profiledata" name="email" type="email" value="<?php echo $email; ?>"><br>
        <label>Functie:</label><br>
        <select name="functionlist" form="profileform">
            <option <?php if ($functie=='Geen'){echo 'selected="selected"';}?>>Geen</option>
            <option <?php if ($functie=='Kapoenenleiding'){echo 'selected="selected"';}?>>Kapoenenleiding</option>
            <option <?php if ($functie=='Welpenleiding'){echo 'selected="selected"';}?>>Welpenleiding</option>
            <option <?php if ($functie=='Pioniersleiding'){echo 'selected="selected"';}?>>Pioniersleiding</option>
            <option <?php if ($functie=='Jonggiverleiding'){echo 'selected="selected"';}?>>Jonggiverleiding</option>
            <option <?php if ($functie=='Giverleiding'){echo 'selected="selected"';}?>>Giverleiding</option>
            <option <?php if ($functie=='Jinleiding'){echo 'selected="selected"';}?>>Jinleiding</option>
        </select><br>
        <label>Hoofdleiding:</label><br>
        <input id="hoofd" name="hoofd" type="checkbox" <?php if ($hoofd==1){echo 'checked';}?>><br>
        <label>Takleiding:</label><br>
        <input id="takleiding" name="takleiding" type="checkbox" <?php if ($takleiding==1){echo 'checked';}?>><br>
        <input id="changepbutton" name="saveprofile" type="submit" value="Opslaan">
        <input id="changepbutton" name="returntoprofile" type="button" onclick="location.href='gebruikers.php'" value="Annuleer">
        <span><?php echo $error14; ?></span>
    </form>
</div>
</body>
</html>