const _ = require('lodash');
const Promise = require('bluebird');
const mongo = require('mongoose').mongo;
const GridFSBucket = mongo.GridFSBucket;
const mime = require('mime');
const errors = require('../errors');

// bucket instance
let _bucket = null;

/**
 * Initialise with mongo db instance.
 * @param {mongo.Db} db Db instance.
 */
module.exports.init = function (db) {
    _bucket = new GridFSBucket(db, {
        bucketName: 'upload'
    });
}

/**
 * Get bucket or throw error if not initialized.
 * @returns {GridFSBucket} bucket.
 */
function getBucket() {
    if (_bucket === null) {
        throw new Error('GridFs not initialized. Call init() once to setup.')
    }

    return _bucket;
}

/**
 * Create a writable stream into the DB
 * @param {string} fileName fileName
 * @param {object} metadata file metadata
 * @param {string} contentType content Type
 * @returns {stream.writeStream} uploaded file id.
 */
module.exports.getWritableStream = function (fileName, metaData, contentType) {
    // open a write stream
    const writeStream = getBucket().openUploadStream(fileName, {
        metadata: metaData,
        contentType: contentType
    });

    return writeStream;
}

/**
 * Upload a file from given readable stream.
 * @param {stream.Readable} readable stream
 * @param {object} metadata file metadata
 * @param {Function} [cancelToken] cancel token
 * @returns {Promise<ObjectId>} uploaded file id.
 */
module.exports.saveFile = async function (readable, metadata, cancelToken) {
    // get file name from metadata
    const fileName = _.get(metadata, 'fileName', 'file');

    // detect content type
    const contentType = _.get(metadata, 'contentType', mime.getType(fileName) || '*/*');

    // open a write stream
    const writeStream = getBucket().openUploadStream(fileName, {
        metadata: metadata,
        contentType: contentType
    });

    // return promise
    return new Promise((resolve, reject) => {
        // register cancellation logicwr
        if (cancelToken) {
            cancelToken(() => writeStream.abort());
        }

        // error handler
        const onErr = _.once(reject);

        // send errors
        readable.on('error', onErr);
        writeStream.once('error', onErr);

        // send completion output
        writeStream.once('finish', () => resolve(writeStream.id));

        // start streaming
        readable.pipe(writeStream);
    });
}

/**
 * Get a saved file info including getStream() function.
 * If no file exists for id, null is returned.
 * @param {ObjectId} id file id
 * @param {Function} [cancelToken] cancel token
 * @returns {Promise<object|null>} file info.
 */
module.exports.getFile = async function (id, cancelToken) {
    // find file documents for id
    const docs = await getBucket().find({ _id: id }).limit(1).toArray();

    // get file doc
    const file = docs[0];

    // no such file
    if (_.isNil(file)) {
        return null;
    }

    // return file info, include getStream() function
    return _.assign(file, {
        getStream: () => {
            // create stream
            const str = getBucket().openDownloadStream(id);

            // cancellation logic
            const onCancel = () => {
                str.unpipe();
                str.pause();
                str.destroy();
            };

            // register cancellation logic
            if (cancelToken) {
                cancelToken(onCancel);
            }

            // return stream
            return str;
        }
    });
}

/** 
 * Generate a cancel token to pass to cancellable file operations.
 * @returns {Function} function that accepts cancelation logic, and calls it when cancel() is invoked on function.
 */
module.exports.cancelToken = function () {
    // cancellation logic
    let cancelLogic;

    // accepts logic
    const token = (logic) => { cancelLogic = logic; };

    // set cancel function, callable only once
    token.cancel = _.once(() => cancelLogic ? cancelLogic() : undefined);

    // return 
    return token;
}

/**
 * Verify the id of file if it exists or not in bucket
 * If no file exists for id, error is thrown.
 * @param {ObjectId} id file id
 * @returns {Error} file info.
 */
module.exports.ensureFileIdExists = async function (id) {
    // find file documents for id
    const docs = await getBucket().find({ _id: id }).limit(1).toArray();

    // get file doc
    const file = docs[0];

    // no such file
    if (_.isNil(file)) {
        throw errors.INVALID_INPUT('No File exists with this Id');
    }

    return;
}