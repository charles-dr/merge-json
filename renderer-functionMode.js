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
var MergeJson = require('./Classes/MergeJson')

let savePath = "./output/gameId.json";
let count = 0;


initialize({gameId: "NEW LEGEND"});


var watcher = chokidar.watch('./timelines', {ignored: /^\./, persistent: true});

watcher
  .on('add', function(path) {
    console.log('File', path, 'has been added');
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            alert('An error occured reading the file.');
            return '';
        }
        addData(data);
    });
  });

document.getElementById('initButton').onclick = () => {
    const mergeJson = new MergeJson(fs);
    const fileName = __dirname + "/timelines/Legends-0.json"; console.log(fileName);
    fs.readFile(fileName, 'utf-8', (err, data) => {
        if (err) {
            alert('An error occured reading the file.');
            return '';
        }
        mergeJson.addData(data);
        mergeJson.addData(data);
        mergeJson.endGame();
    });
}

document.getElementById('endButton').onclick = () => {
    endGame();
}


function initialize(header) {
    '[initialzed]'
    let temp = `{ "gameHeader":${JSON.stringify(header)}, "timeline":[`;
    writeContent(temp, 'CREATE');
}

function writeContent(content, mode = 'APPEND') {
    console.log();
    if (mode !== 'APPEND') {
        fs.writeFile(savePath, content, (err) => {
            return false;
        })
    } else {
        fs.appendFile(savePath, content, (err) => {
            return false;
        });
    }
    return true;
}

function addData(content) {
    console.log('[addData]');
    writeContent(count === 0 ? content : "," + content);
    count++;
}

function endGame() {
    const content = "]}";
    writeContent(content);
}