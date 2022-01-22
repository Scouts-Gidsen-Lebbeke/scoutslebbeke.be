<?php
include 'login.php';
session_start();
if (isset($_SESSION['login_user'])){
    header("location: index.php");
}
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <title>Login leiding</title>
    <link href="style.css" rel="stylesheet" type="text/css">
    <meta name="author" content="">
    <link rel="icon" href="../images/loginim.png">
    <script src="../jquery-3.3.1.min.js"></script>
    <script>
        //shortcut to website
        document.addEventListener('keydown', ev => {
            if (ev.code === 'KeyE' && ev.ctrlKey && ev.altKey) {
                window.location.replace("https://www.scoutslebbeke.be/?q=nieuwtjes/nieuwtjes.html");
            }
        });
    </script>
</head>
<body id="loginbody">
<div id="main">
    <div id="login">
        <form action="" method="post">
            <label for="name">Gebruikersnaam:</label>
            <input id="name" name="username" placeholder="Gebruikersnaam" type="text">
            <label for="password">Wachtwoord:</label>
            <input id="password" name="password" placeholder="**********" type="password">
            <input type="submit" id="loginbutton" name="submit" alt="search" value="">
            <span><?php echo $error; ?></span>
        </form>
    </div>
</div>
</body>
</html>
