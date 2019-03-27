const _ = require('lodash');

/**
 * Base API errors
 */
const baseErrorDefs = Object.freeze({
    'INTERNAL': {
        status: 500,
        message: 'Internal server error'
    },
    'UNAUTHORIZED': {
        status: 401,
        message: 'Unauthorized access'
    },
    'NOT_IMPLEMENTED': {
        status: 501,
        message: 'Resource method not implemented'
    },
    'INVALID_INPUT': {
        status: 400,
        message: 'Invalid input in request'
    },
    'NOT_FOUND': {
        status: 404,
        message: 'No such resource exists'
    },
    'NOT_ALLOWED': {
        status: 403,
        message: 'Operation not allowed'
    },
    'NO_ACCESS': {
        status: 403,
        message: 'Access not allowed'
    },
    'ALREADY_EXISTS': {
        status: 409,
        message: 'Resource already exists'
    },
    'SIZE_LIMIT': {
        status: 413,
        message: 'Input size exceeds allowed limits'
    },
    'RATE_LIMIT': {
        status: 429,
        message: 'Request rate exceeds allowed limits'
    }
});

/**
 * Holds base erro functions
 */
let BASE_ERRORS = null;

/**
 * @class
 * API Error class.
 */
module.exports = class ApiError extends Error {

    /**
     * Constructor
     * @param {string} message error message
     */
    constructor(message, status, code) {
        super(message);
        this._status = status;
        this._code = code;
    }

    /**
     * Base error functions.
     * @type {object}
     */
    static get baseErrors() {
        if (BASE_ERRORS === null) {
            BASE_ERRORS = ApiError.extendErrors({});
        }
        return BASE_ERRORS;
    }

    /**
     * HTTP status code
     * @type {number}
     */
    get status() {
        return this._status;
    }

    /**
     * API error code
     * @type {string}
     */
    get code() {
        return this._code;
    }

    /**
     * Create extended error functions for given error definition object.
     * @param {{status:number,message:string}} errDef error definition object.
     */
    static extendErrors(errDef) {
        const errors = _.defaults(errDef || {}, baseErrorDefs);
        return _.mapValues(errors, (val, key) => {
            return (message) => new ApiError(message || val.message, val.status, key);
        });
    }
}