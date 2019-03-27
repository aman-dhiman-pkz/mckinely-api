const route = require('../../lib/route');
const Promise = require('bluebird');
const _ = require('lodash');
const Busboy = require('busboy');
const errors = require('../../errors');
const fileFs = require('../../lib/gridFs');
const mime = require('mime');

/**
 * @apiGroup File
 * 
 * @api {post} /upload/files upload files using form data
 * 
 * @apiSuccess (200) {string} _id id of created file
 * 
 */
module.exports = route.post('/upload/files', async (req, res) => {

    // must be a multipart request
    if (!req.is('multipart/form-data')) {
        throw errors.INVALID_INPUT('Not a "multipart/form-data" content.');
    }

    // map event based operation to async function result
    return new Promise((resolve, reject) => {

        // allowed max size 
        const maxSizeBytes = process.env.MAX_FILE_SIZE * 1024 * 1000;

        // create busboy instance
        const bb = new Busboy({ headers: req.headers, limits: { parts: 1, files: 1, fileSize: maxSizeBytes } });

        // error handler
        const onErr = _.once(reject);

        // multipart limit errors
        bb.once('partsLimit', () => onErr(errors.INVALID_INPUT('Only single part expected.')));
        bb.once('filesLimit', () => onErr(errors.INVALID_INPUT('Only single file expected.')));

        // handle file part
        bb.once('file', (fieldName, stream, fileName, encoding, contentType) => {

            // only allow configured mime types
            const mimeType = contentType || mime.getType(fileName || 'file');
            const allowTypes = [];
            if (allowTypes.length > 0 && !_.includes(allowTypes, mimeType)) {
                onErr(errors.INVALID_INPUT(`File type ${mimeType} is not allowed.`));
                return;
            }

            // save to file fs
            const saveToken = fileFs.cancelToken();
            fileFs.saveFile(stream, {
                fileName: fileName,
                contentType: contentType,
                userId: process.env.ADMIN_ID
            }, saveToken).then((fileId) => {
                // send response, if error has not been sent already
                if (!res.headersSent) {
                    res.json({ _id: fileId });
                }
                resolve();
            }).catch(onErr); // catch errors

            // handle size limit
            stream.once('limit', () => {
                // send error
                onErr(errors.SIZE_LIMIT(`File larger than max allowed: ${1} MB.`));
                // cancel save
                saveToken.cancel();
            });
        });

        // start streaming
        req.pipe(bb);

    });
});
