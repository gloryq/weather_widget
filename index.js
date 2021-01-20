const { BrowserWindow } = require('electron').remote;
const closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', function (event) {
    var win = BrowserWindow.getFocusedWindow();
    win.close()
});