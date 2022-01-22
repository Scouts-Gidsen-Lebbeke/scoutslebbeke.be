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
    <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
    <script>
        //shortcut to website
        document.addEventListener('keydown', ev => {
            if (ev.code === 'KeyE' && ev.ctrlKey && ev.altKey) {
                window.location.href = '/index.html';
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
