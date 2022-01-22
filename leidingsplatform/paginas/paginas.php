<?php include '../session.php'; ?>
<?php include 'paginashandler.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Pagina's</h1>
    <p>Kies een pagina om te bewerken:</p>
    <form action="" method="post">
        <select name="pageList">
            <option selected="selected">Nieuwtjes</option>
            <option>Over ons</option>
            <option>Uniform</option>
            <option>Inschrijven</option>
            <option>Missie</option>
            <option>Verhuur</option>
            <option>Nuttige links</option>
            <option>Kapoenen</option>
            <option>Welpen</option>
            <option>Jonggivers</option>
            <option>Givers</option>
            <option>Jins</option>
            <option>Leiding</option>
            <option>Sprokkel</option>
            <option>Archief</option>
            <option>Contact</option>
            <option>Contact</option>
            <option>Kamp</option>
            <option>Weekend</option>
        </select>
        <input id="changesbutton" name="setPage" type="submit" value="Selecteer">
    </form>
    <form action="" method="post">
        <input id="filepath" name="filepath" type="hidden" value="<?php echo $selected; ?>"><br>
        <textarea style="width: 95%; height: 280px;" id="pagecontent" name="pagecontent"><?php echo file_get_contents($selected);?></textarea><br>
        <input id="changecbutton" name="savepagecontent" type="submit" value="Opslaan">
        <span><?php echo $error8; ?></span>
    </form>
</div>
</body>
</html>