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

// variables
const defaultWatchDir = "watch";
const defaultOutputDir ="output";
let watchDir;
let outputDir;

let mergeJson;

initialize();


// select watch folder
document.getElementById('watch-dir').onchange = () => {
    const path = document.getElementById('watch-dir').value;
    if (path !== undefined) {
        watchDir = path;
        setWatchDir(path);
    }
}

// select output folder
document.getElementById('output-dir').onchange = () => {   
    const path = document.getElementById('output-dir').value;
    if (path !== undefined) {
        outputDir = path;
        setOutputDir(path);
    }
}

// start to watch
document.getElementById('startButton').onclick = () => {
    console.log('[You started to watch!]');
    const gameId = document.getElementById('game-id').value; 
    if (!gameId || gameId === undefined) {
        alert('Please input game ID!');
        document.getElementById('game-id').focus();
        return 0;
    }
    console.log(watchDir, outputDir);
    mergeJson = new MergeJson(watchDir, outputDir, {gameId: gameId});
}

// end watching
document.getElementById('endButton').onclick = () => {
    console.log('[You ended watching!]');
    mergeJson.endGame();
    // addHistory('Ended the game!');
}

// add history
function addHistory(message) {
    const textArea = document.getElementById('output');
    textArea.value = textArea.value + '\n' + message;
}

function initialize() {
    watchDir = defaultWatchDir;
    outputDir = defaultOutputDir;
    setWatchDir(defaultWatchDir);
    setOutputDir(defaultOutputDir);
}

function setWatchDir(path) {
    document.getElementById('watch-dir').value = path;
}

function setOutputDir(path) {
    document.getElementById('output-dir').value = path;
}
