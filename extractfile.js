const config = require('./config.js');
const { spawn } = require('child_process');

async function extract_files(key) {
    let child = spawn('python', ['extract.py', '-k', key, '-o', key + '.jpg', config.images_db]);

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
    const exitCode = await new Promise( (resolve, reject) => {
        child.on('close', resolve);
    });

    if( exitCode) {
        throw new Error( `subprocess error exit ${exitCode}, ${error}`);
    }
    return data;
}

module.exports = { extract_files }

extract_files('16T8UGBS6MZQAR1BEOLE5AJ2KFFN0221OV9JRKRX-501075612-1590305735320').then(
    data=> {console.log("async result:\n" + data);},
    err=>  {console.error("async error:\n" + err);}
);
//extract_files('16T8UGBS6MZQAR1BEOLE5AJ2KFFN0221OV9JRKRX-501075612-1590305735320');