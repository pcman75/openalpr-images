require('dotenv').config();
const config = require('./config.js');

// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');

module.exports = async function upload(filename) {
   const storage = new Storage();

   console.log('uploading: ' + filename);
    let finish = await storage.bucket(config.bucket_name).upload(filename, {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            // By setting the option `destination`, you can change the name of the
            // object you are uploading to a bucket.
            metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: 'public, max-age=31536000',
            },
    });
    console.log('finished uploading: ' + filename);
    return finish;
}

//upload('/Users/manolic/Downloads/Archive/WhatsApp Image 2020-05-21 at 16.06.59.jpeg');