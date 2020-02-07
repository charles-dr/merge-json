module.exports = class MergeJson {
    fs;         // file system instance
    savePath;   // target json file path
    count;      // cont of time lines

    constructor(fs, savePath = './output/gameId.json', header = {}, initializeFile = false) {
        console.log('[MergeJson] initialized!');
        // file system instance
        this.fs = fs;
        this.savePath = savePath;
        this.count = 0;
        let temp = `{ "gameHeader":${JSON.stringify(header)}, "timeline":[`;
        this.writeContent(temp, 'CREATE');
    }

    addData(content) {
        this.writeContent(this.count === 0 ? content : "," + content);
        this.count ++;
    }

    writeContent(content, mode = 'APPEND') {
        if (mode !== 'APPEND') {
            this.fs.writeFile(this.savePath, content, { flag: 'w' }, (err) => {
                return false;
            })
        } else {
            this.fs.appendFile(this.savePath, content, (err) => {
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

