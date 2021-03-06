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

module.exports = async function extractFiles(key, extractfolder) {
    const getDbForEpoch = (folder, epoch) => {
        let dbs = fs.readdirSync(folder).filter(filename =>-1 == filename.search(/^.*\.(mdb-lock)$/)).sort();
        let i = 0;
        let found = false;
        for (i in dbs) {
            let epoch_file = parseInt(dbs[i].substr(0, dbs[i].lastIndexOf('.mdb')))
            if (epoch_file > epoch){
                found = true;
                break;
            }
        }
        if(found)
            return dbs[i - 1];
        else
            return dbs[i]
    }

    let epoch = parseInt(key.match(/([A-Z0-9]+)/g)[2]);

    let db = getDbForEpoch(config.images_db, epoch);
    await executePython(['extract_image.py', '-k', key, '-o', extractfolder + key + '.jpg', config.images_db + '/' + db]);

    db = getDbForEpoch(config.videos_db, epoch);
    await executePython(['extract_video.py', '-e', epoch, '-o', extractfolder + key + '.mp4', config.videos_db + '/' + db]);
    return key;
}
