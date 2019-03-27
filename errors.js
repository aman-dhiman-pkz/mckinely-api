/**
 * API specific errors
 */
module.exports = require('./lib/ApiError').extendErrors({
    'INVALID_OTP': {
        status: 403,
        message: 'OTP does not match'
    },
    'EMAIL_ALREADY_EXISTS': {
        status: 409,
        message: 'Email already exists'
    },
    'PHONE_ALREADY_EXISTS': {
        status: 409,
        message: 'Phone already exists'
    },
    'INVALID_LOGIN': {
        status: 400,
        message: 'Login credentials do not match any registered user.'
    },
    'INVALID_PASSWORD': {
        status: 400,
        message: 'Given password is not coreect'
    },
    'CLASS_NOT_SUPPORTED': {
        status: 403,
        message: 'Center does not support user class'
    },
    'PAYMENT_GATEWAY_ERROR': {
        status: 503,
        message: 'Payment service is not available'
    },
    'ALREADY_PURCHASED': {
        status: 403,
        message: 'The product is already purchased by user'
    },
    'SEAT_UNAVAILABLE': {
        status: 503,
        message: 'All seats for choosen centers are booked'
    },
    'SERVICE_UNAVAILABLE': {
        status: 503,
        message: 'Service unavailable at the moment'
    }
});
