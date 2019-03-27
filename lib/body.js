const _ = require('lodash');
const util = require('util');
const bodyParser = require('body-parser');
const mw = require('./mw');
const ApiError = require('./ApiError');

const LIMIT = 1024*1024*5;

// body paser, max 5 Mb
let jsonParser = bodyParser.json({ limit: LIMIT});
jsonParser = util.promisify(jsonParser.bind(jsonParser));

/**
 * Async middleware for parsing request JSON body.
 * @param {Request} req request
 * @param {Response} res response
 */
async function body(req, res) {
    try {        
        await jsonParser(req, res);
    } catch (err) {
        throw ApiError.baseErrors.INVALID_INPUT(`Input parse error: ${err.message}`);
    }
}

/**
 * Body parser middleware
 */
module.exports = mw(body);