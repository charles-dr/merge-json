// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


var app = require('electron').remote;
const { ipcRenderer, remote } = require( "electron" );
var dialog = app.dialog;
var fs = require('fs');
var chokidar = require('chokidar');

var MergeJson = require('./Classes/MergeJson');

const mergeJson = new MergeJson(fs, __dirname + '/../output/gameIDD.json', {gameID: "NEW GAME"}); //mergeJson.__console();
addHistory('Class has been initialized!');
addHistory(`Click [End Game] to complete the json.\n`);

var watcher = chokidar.watch('./timelines', {ignored: /^\./, persistent: true});

watcher
  .on('add', function(path) {
    addHistory('File ' +  path + ' has been added');
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            alert('An error occured reading the file.');
            return '';
        }
        mergeJson.addData(data);
    });
  });

document.getElementById('endButton').onclick = () => {
    mergeJson.endGame();
    addHistory('Ended the game!');
}

function addHistory(message) {
    const textArea = document.getElementById('output');
    textArea.value = textArea.value + '\n' + message;
}
