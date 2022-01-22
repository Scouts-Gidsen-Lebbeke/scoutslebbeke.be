<?php include '../session.php'; ?>
<?php include 'handleprofileadd.php' ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Voeg gebruiker toe</h1>
    <form action="" method="post" id="profileform">
        <label>Voornaam:</label><br>
        <input id="profiledata" name="firstname" type="text"><br>
        <label>Achternaam:</label><br>
        <input id="profiledata" name="lastname" type="text"><br>
        <label>Bijnaam:</label><br>
        <input id="profiledata" name="nickname" type="text"><br>
        <label>Totem:</label><br>
        <input id="profiledata" name="totem" type="text"><br>
        <label>Gsm:</label><br>
        <input id="profiledata" name="gsm" type="tel"><br>
        <label>E-mail:</label><br>
        <input id="profiledata" name="email" type="email"><br>
        <label>Functie:</label><br>
        <select name="functionlist" form="profileform">
            <option>Geen</option>
            <option>Kapoenenleiding</option>
            <option>Welpenleiding</option>
            <option>Pioniersleiding</option>
            <option>Jonggiverleiding</option>
            <option>Giverleiding</option>
            <option>Jinleiding</option>
        </select><br>
        <label>Hoofdleiding:</label><br>
        <input id="hoofd" name="hoofd" type="checkbox"><br>
        <label>Takleiding:</label><br>
        <input id="takleiding" name="takleiding" type="checkbox"><br>
        <input id="changepbutton" name="addprofile" type="submit" value="Voeg toe">
        <input id="changepbutton" name="returntousers" type="button" onclick="location.href='gebruikers.php'" value="Annuleer">
        <span><?php echo $error13; ?></span>
    </form>
</div>
</body>
</html>