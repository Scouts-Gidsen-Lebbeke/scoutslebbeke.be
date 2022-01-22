<?php include '../session.php'; ?>
<?php include 'userhandler.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Gebruikers</h1>
    <p>Kies een gebruiker of voeg een nieuwe toe:</p>
    <form action="" method="post">
        <select name="userList">
            <?php include 'userlist.php'; ?>
        </select>
        <input id="selectuserbutton" name="selectuser" type="submit" value="Selecteer">
        <input id="selectuserbutton" name="newuser" type="button" onclick="location.href='adduser.php'" value="Voeg gebruiker toe">
        <span><?php echo $error12; ?></span>
    </form>
    <?php include 'showuserinfo.php'; ?>
    <form action="" method="post">
        <input id="edituser" name="username" type="hidden" value="<?php echo $username2; ?>">
        <input id="edituserbutton" name="edituser" type="button" <?php if (empty($username2)){echo 'disabled';}?> onclick="<?php echo 'location.href=\'edituser.php?q='.$username2.'\''; ?>" value="Wijzig profiel">
        <input id="edituserbutton" name="editimageuser" type="button" <?php if (empty($username2)){echo 'disabled';}?> onclick="<?php echo 'location.href=\'editimageuser.php?q='.$username2.'\''; ?>" value="Wijzig profielfoto">
        <input id="edituserbutton" name="deleteuser" type="submit" value="Verwijder gebruiker"<?php if (empty($username2)){echo 'disabled';}?>><br>
        <span><?php echo $error13; ?></span>
    </form>
</div>
</body>
</html>