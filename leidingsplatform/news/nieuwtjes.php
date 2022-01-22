<?php include '../session.php'; ?>
<?php include 'nieuwtjeshandler.php'; ?>
<!DOCTYPE html>
<html>
<head>
    <?php include '../head.php'; ?>
</head>
<body>
<?php include '../header.php'; ?>
<?php include '../sidebar.php'; ?>
<div id="content">
    <h1>Nieuwtjes</h1>
    <div>
        <p>Voeg hieronder een nieuwtje toe aan de startpagina:</p>
        <form action="" method="post" enctype="multipart/form-data">
            <label><b>Titel:</b></label><br>
            <input id="itemtitle" name="itemtitle" type="text" placeholder="Titel van net nieuwtje"><br>
            <label><b>Tekst:</b></label><br>
            <button title="Voeg externe link toe" id="linkbutton" type="button" onclick="insertAtCursor(itemcontent)"><img src="../link.png" class="itembutton"></button>
            <button title="Voeg interne link toe" id="internlinkbutton" type="button" onclick="intern(itemcontent)"><img src="../intern.jpg" class="itembutton"></button>
            <button title="Maak geselecteerde tekst schuingedrukt" id="italicbutton" type="button" onclick="changestyle(itemcontent, '<i>', '</i>')"><img src="../italic.png" class="itembutton"></button>
            <button title="Maak geselecteerde tekst vet" id="boldbutton" type="button" onclick="changestyle(itemcontent, '<b>', '</b>')"><img src="../bold.png" class="itembutton" ></button>
            <button title="Onderlijn geselecteerde tekst" id="underlinedbutton" type="button" onclick="changestyle(itemcontent, '<u>', '</u>')"><img src="../underlined.png" class="itembutton"></button>
            <textarea style="width: 95%; height: 200px;" id="itemcontent" name="itemcontent" placeholder="Tekst bij het nieuwtje"></textarea><br>
            <label><b>Afbeelding:</b> (enkel .jpg, .png of .jpeg)</label><br>
            <input type="file" name="picToUpload" id="picToUpload"><br>
            <input type="submit" value="Voeg nieuwtje toe" name="savenewitem">
            <span><?php echo $error7; ?></span>
        </form>
    </div>
</div>
<script src="texteditor.js"></script>
</body>
</html>