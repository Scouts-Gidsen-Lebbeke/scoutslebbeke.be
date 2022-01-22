<?php
session_start();
if (!isset($_SESSION['login_user'])) {
    session_destroy();
    header('Location: front.php');
}
?>
<!DOCTYPE html>
<html lang="nl_BE">
<head>
    <meta charset="UTF-8">
    <title>Leidingplatform</title>
    <link href="style.css" rel="stylesheet" type="text/css">
    <meta name="author" content="Robin Keppens">
    <link rel="icon" href="../images/loginim.png">
    <script src="../jquery-3.3.1.min.js"></script>
    <script src="shared.js"></script>
    <script src="https://cdn.tiny.cloud/1/3zke4762j1cnv5l70ctyfbpncqoc7ztulh9sri9haivlajkw/tinymce/5/tinymce.min.js" referrerpolicy="origin"></script>
</head>
<body>
    <div id="profile">
        <b id="welcome">Welkom, <?php echo $_SESSION['login_user']?>!</b>
        <a href="logout.php"><b id="logout">Afmelden</b></a>
    </div>
    <div id="menu">
        <div onclick="load('home')" class="menubaritem">Home</div>
        <!--div onclick="load('profile')" class="menubaritem">Profiel</div-->
        <!--div onclick="load('news')"class="menubaritem">Nieuwtjes</div-->
        <div onclick="load('calendar')" class="menubaritem">Kalender</div>
        <div onclick="load('sprokkel')" class="menubaritem">Sprokkel</div>
        <!--div onclick="load('pages')"class="menubaritem">Pagina\'s</div-->
        <!--div onclick="load('style')" class="menubaritem">Stijl</div-->
        <!--div onclick="load('meta')" class="menubaritem">Meta</div-->
        <!--div onclick="load('users')" class="menubaritem">Gebruikers</div-->
        <div onclick="load('test')" class="menubaritem">Test</div>
    </div>
    <div id="content"></div>
</body>
<script>
    load('home');
</script>
</html>