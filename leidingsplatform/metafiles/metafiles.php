<?php include 'metafileshandler.php'; ?>
<?php include '../session.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Metafiles</h1>
    <p>Kies een metafile om te bewerken:</p>
    <form action="" method="post">
        <select name="fileList">
            <option selected="selected">Credits</option>
            <option>Navigatiebalk</option>
            <option>Mobiele navigatiebalk</option>
            <option>Javascript</option>
            <option>Meta-index</option>
        </select>
        <input id="changesbutton" name="setFile" type="submit" value="Selecteer">
    </form>
    <form action="" method="post">
        <input id="filepath" name="filepath" type="hidden" value="<?php echo $selected; ?>"><br>
        <textarea style="width: 95%; height: 280px;" id="pagecontent" name="pagecontent"><?php echo file_get_contents($selected);?></textarea><br>
        <input id="changecbutton" name="savefilecontent" type="submit" value="Opslaan">
        <span><?php echo $error8; ?></span>
    </form>
</div>
</body>
</html>