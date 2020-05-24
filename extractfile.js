const config = require('./config.js');
const { spawn } = require('child_process');
const fs = require('fs');

async function executePython(arg) {
    let child = spawn('python', arg);

    let data = "";
    for await (const chunk of child.stdout) {
        console.log(chunk.toString());
        data += chunk;
    }
    let error = "";
    for await (const chunk of child.stderr) {
        console.error(chunk.toString());
        error += chunk;
    }
    const exitCode = await new Promise((resolve, reject) => {
        child.on('close', resolve);
    });

    if (exitCode) {
        throw new Error(`subprocess error exit ${exitCode}, ${error}`);
    }
    return data;
}

async function extract_files(key) {
    const getDbForEpoch = (folder) => {
        let dbs = fs.readdirSync(folder).sort();
        let i = 0;
        for (i in dbs) {
            let epoch_file = parseInt(dbs[i].substr(0, dbs[i].lastIndexOf('.mdb')))
            if (epoch_file > epoch)
                break;
        }
        if(i > 2)
            return dbs[i - 2];
        else
            return dbs[0]
    }

    let epoch = parseInt(key.match(/([A-Z0-9]+)/g)[2]);

    let db = getDbForEpoch(config.images_db);
    await executePython(['extract_image.py', '-k', key, '-o', key + '.jpg', config.images_db + '/' + db]);

    db = getDbForEpoch(config.videos_db);
    await executePython(['extract_video.py', '-e', epoch, '-o', key + '.mp4', config.videos_db + '/' + db]);
}

module.exports = { extract_files }

extract_files('16T8UGBS6MZQAR1BEOLE5AJ2KFFN0221OV9JRKRX-501075612-1590066989394').then(
    data => { console.log("async result:\n" + data); },
    err => { console.error("async error:\n" + err); }
);
//extract_files('16T8UGBS6MZQAR1BEOLE5AJ2KFFN0221OV9JRKRX-501075612-1590305735320');