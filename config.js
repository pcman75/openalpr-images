const config = {
    bucket_name: 'openalpr-files',
    images_db: '/var/lib/openalpr/plateimages/image_db',
    videos_db: '/var/lib/openalpr/videoclips/image_db',
    working_folder: '/var/lib/openalpr/working_folder',
    subscriptionName: 'upload-images-sub'
    //ack_timeout = 60
};

module.exports = config;