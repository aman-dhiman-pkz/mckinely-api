const _ = require('lodash');
const route = require('../../lib/route');
const errors = require('../../errors');
const fileFs = require('../../lib/gridFs');
const moment = require('moment');
const mongoose = require('mongoose');


/**
 * @apiGroup File
 * 
 * @api {get} /download/files/:id get the file by id
 * 
 * @apiParam (Request path) {String} id id of the  file
 * 
 * @apiSuccess (200) {File} Requested file
 * 
 */
module.exports = route.get('/download/files/:id', async (req, res) => {

    // validate id
    const id = mongoose.Types.ObjectId(req.params.id);

    // get file
    const getToken = fileFs.cancelToken();
    const file = await fileFs.getFile(id, getToken);

    // must exist
    if (_.isNil(file)) {
        getToken.cancel();
        throw errors.NOT_FOUND(`No such file with id: ${id}`);
    }

    // get file timestamp
    const ts = toValidDate(file.uploadDate);

    // set headers
    res.set({
        'Content-Type': file.contentType,
        'Content-Length': file.length,
    });

    // set timestamp header
    if (ts) {
        res.set('Last-Modified', ts.toISOString());
    }

    // set download headers in download query argument is true
    if (req.query.download === 'true') {
        res.attachment(file.filename);
    }

    // return 304 if not modified
    const ifMod = toValidDate(req.get('If-Modified-Since'));
    if (ts && ifMod && ts.isSameOrBefore(ifMod)) {
        res.status(304).end();
        return;
    }

    // get stream
    str = file.getStream();

    // stream finish promise
    const onEnd = new Promise((resolve, reject) => {
        str.on('end', resolve);
        str.on('error', reject);
    });

    // start streaming
    file.getStream().pipe(res);

    // await for stream end
    await onEnd;
});

/**
 * Parse given value to moment date, or return null.
 * @param {*} val value
 */
function toValidDate(val) {
    if (_.isNil(val)) { return null; }

    let date;
    try {
        date = moment(val);
    } catch (e) {
        return null;
    }
    return date.isValid() ? date : null;
}