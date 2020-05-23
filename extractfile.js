const lmdb = require('node-lmdb');

function extract_file(filename) {

    var env = new lmdb.Env();
    try {
        env.open({
            //path: '/var/lib/openalpr/plateimages/',
            path: '/home/deepracer/test/',
            mapSize: 1 * 1024 * 1024 * 1024, // maximum database size
            //readOnly: true,
            maxDbs: 1
        });
        // Open database
        var dbi = env.openDbi({
            name: "1589777607692",
            create: false
        });

        var txn = env.beginTxn();

        var stat = dbi.stat(txn);
        console.log("\ndatabase statistics:");
        console.dir(stat);

        var cursor = new lmdb.Cursor(txn, dbi);

        for (var found = cursor.goToFirst(); found !== null; found = cursor.goToNext()) {
            // Here 'found' contains the key, and you can get the data with eg. getCurrentString/getCurrentBinary etc.
            // ...
            console.log(found);
        }

        txn.commit();
    }
    catch (err) {
        console.error(err);
    }
    finally {
        env.close();
    }
}
module.exports = { extract_file }

extract_file('/var/lib/openalpr/plateimages/image_db/1589777607692.mdb');