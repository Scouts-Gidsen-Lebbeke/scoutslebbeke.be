function insertAtCursor(myField) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myValue = myField.value.substring(startPos,endPos);
        myField.value = myField.value.substring(0, startPos)
            + '<a href="">' + myValue + '</a>'
            + myField.value.substring(endPos, myField.value.length);
        myField.focus();
        myField.selectionStart = startPos + 9;
        myField.selectionEnd = startPos + 9;
    } else {
        myField.value += myValue;
    }
}
function changestyle(myField, tag1, tag2) {
    //no IE support
    if (myField.selectionStart || myField.selectionStart === '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myValue = myField.value.substring(startPos,endPos);
        myField.value = myField.value.substring(0, startPos)
            + tag1 + myValue + tag2
            + myField.value.substring(endPos, myField.value.length);
        myField.focus();
        if (startPos===endPos){
            myField.selectionStart = startPos + 3;
            myField.selectionEnd = startPos + 3;

        } else {
            myField.selectionStart = startPos + 7 + myValue.length;
            myField.selectionEnd = startPos + 7 + myValue.length;
        }

    } else {
        myField.value += tag1 + tag2;
    }
}
function intern(myField) {
    //IE support
    if (document.selection) {
        myField.focus();
        sel = document.selection.createRange();
        sel.text = myValue;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart === '0') {
        var startPos = myField.selectionStart;
        var endPos = myField.selectionEnd;
        myValue = myField.value.substring(startPos,endPos);
        myField.value = myField.value.substring(0, startPos)
            + '<a onclick="load(\'directory\',\'page\')" href="#">' + myValue + '</a>'
            + myField.value.substring(endPos, myField.value.length);
        myField.focus();
        myField.selectionStart = startPos + 18;
        myField.selectionEnd = startPos + 27;
    } else {
        myField.value += myValue;
    }
}