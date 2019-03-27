const _ = require('lodash');
const ApiError = require('./ApiError');
const logApi = require('./log').tag('API_ERROR');
const logInternal = require('./log').tag('INTERNAL_ERROR');

/**
 * Async middleware for handling API errors.
 * @param {Error} err error
 * @param {Request} req request
 * @param {Response} res response
 * @param {Function} next next callback
 */
function onError(err, req, res, next) {
    // log and convert to API error
    if (!(err instanceof ApiError)) {
        logInternal.error(err);
        err = ApiError.baseErrors.INTERNAL();
    } else {
        logApi.error(err.code, err.message);
    }

    // send API error JSON
    if (!res.headersSent) {
        res.status(err.status);
        res.json({
            isError: true,
            code: err.code,
            message: err.message
        });
    }

    // done
    next();
}

/**
 * Error handler middleware.
 */
module.exports = (app) => app.use(onError);
