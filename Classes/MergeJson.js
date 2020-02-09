var fs = require('fs');
var chokidar = require('chokidar');
const makeDir = require('make-dir');

const relPath = '/..';

module.exports = class MergeJson {

    count;      // cont of time lines
    watchDir;
    outputDir;
    outputFile;
    parentDir;

    /**
     * watchDir
     * outputDir
     * header
     * */
    constructor(watchDir, outputDir, header = { gameId: 'GAME_ID' }) {
        console.log('[MergeJson] initialized!');

        // initialize variables
        this.count = 0;
        this.outputDir = outputDir;
        this.watchDir = watchDir;
        this.outputFile = `${header.gameId}.json`;
        this.checkFolderExists();

        // write the json header
        const content = `{ "gameHeader":${JSON.stringify(header)}, "timeline":[`;
        
        this.writeContent(content, 'CREATE');


        // trigger the watch
        this.triggerWatch();
    }

    checkFolderExists() {
        [this.watchDir, this.outputDir].forEach(async (dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
                // await makeDir('watch');
            }
        });
    }

    triggerWatch() {

        var watcher = chokidar.watch(`${__dirname}/../${this.watchDir}/`, {
            ignored: /^\./,
            followSymlinks: false,
            usePolling: true,
            depth: undefined,
            interval: 1000,
            ignorePermissionErrors: false
        });
        const outputPath = __dirname + `/../${this.outputDir}/${this.outputFile}`; // console.log('[output]', outputPath);
        let count = 0;
        let watchedPaths = [];
        watcher
            .on('add', function (path) {
                // addHistory('File ' +  path + ' has been added');
                console.log('[watch]', path);
                let duplicated = false;               

                if (watchedPaths.includes(path) === false) {
                    watchedPaths.push(path);
                    const data = fs.readFileSync(path, 'utf-8');
                    if (!data) {
                        alert('An error occured reading the file.');
                        return '';
                    }
                    // this.addData(data);
                    const content = count === 0 ? data : "," + data;
                    fs.appendFileSync(outputPath, content);
                    count++;
                }

                // check path duplicated
                // var watchedPaths = watcher.getWatched();
                // console.log('[watchedPaths]', watchedPaths);

                // for (let key in watchedPaths) {
                //     if (watchedPaths[key] !== undefined) {
                //         for (let relPath of watchedPaths[key]) {
                //             const temp = `${key}\\${relPath}`;
                //             if (path == temp) { duplicated = true; }
                //         }
                //     }
                // }
                // // ### check path duplicated
                
                // if (!duplicated) {
                //     const data = fs.readFileSync(path, 'utf-8');
                //     if (!data) {
                //         alert('An error occured reading the file.');
                //         return '';
                //     }
                //     // this.addData(data);
                //     const content = count === 0 ? data : "," + data;
                //     fs.appendFileSync(outputPath, content);
                //     count++;
                // }
            });
    }

    addData(content) {
        this.writeContent(this.count === 0 ? content : "," + content);
        this.count++;
    }

    writeContent(content, mode = 'APPEND') {
        const outputPath = __dirname + `/../${this.outputDir}/${this.outputFile}`; // console.log('[output]', outputPath, content);
        if (mode !== 'APPEND') {
            fs.writeFileSync(outputPath, content);
        } else {
            fs.appendFile(outputPath, content, (err) => {
                return false;
            });
        }
        return true;
    }

    endGame() {
        const content = "]}";
        this.writeContent(content);
    }

    __console() {
        console.log('[hi]');
    }
}

