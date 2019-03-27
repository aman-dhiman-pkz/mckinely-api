/**
 * API specific errors
 */
module.exports = require('./lib/ApiError').extendErrors({
    'SERVICE_UNAVAILABLE': {
        status: 503,
        message: 'Service unavailable at the moment'
    },
    'SOMETHING_WENT_WRONG': {
        status: 503,
        message: 'Some thing went wrong at the moment'
    }
});
