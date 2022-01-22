<?php include '../session.php'; ?>
<?php include 'stylehandler.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Stijl</h1>
    <form action="" method="post">
        <textarea style="width: 95%; height: 280px;" id="stylecontent" name="pagecontent"><?php echo file_get_contents('../../scoutslebbeke.css');?></textarea><br>
        <input id="changestbutton" name="savepagecontent" type="submit" value="Opslaan">
        <span><?php echo $error10; ?></span>
    </form>
    <p>Afbeeldingen komen terecht in de map "images/":</p>
    <form action="" method="post" enctype="multipart/form-data">
        <input type="file" name="fileToUpload" id="fileToUpload"><br>
        <input type="submit" value="Voeg afbeelding toe" name="submit">
        <span><?php echo $error11; ?></span>
    </form>
</div>
</body>
</html>