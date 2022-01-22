<?php include '../session.php'; ?>
<?php include 'handlepasswordchange.php' ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Wijzig wachtwoord</h1>
    <p>Het nieuwe wachtwoord mag niet hetzelfde zijn als het vorige, moet minstens 6 tekens lang zijn en moet zowel cijfers als letters bevatten</p>
    <form action="" method="post">
        <label>Oud wachtwoord:</label><br>
        <input id="profiledata" name="oldpw" type="password" placeholder="*********"><br>
        <label>Nieuw wachtwoord:</label><br>
        <input id="profiledata" name="newpw1" type="password" placeholder="*********"><br>
        <label>Herhaal nieuw wachtwoord:</label><br>
        <input id="profiledata" name="newpw2" type="password" placeholder="*********"><br>
        <input id="changepbutton" name="savepassword" type="submit" value="Opslaan">
        <input id="changepbutton" name="returntoprofile" type="button" onclick="location.href='profiel.php'" value="Annuleer">
        <span><?php echo $error3; ?></span>
    </form>
</div>
</body>
</html>