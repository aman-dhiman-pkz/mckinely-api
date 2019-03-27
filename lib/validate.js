const errors = require('../errors');
const Ajv = require('ajv');
const mongoose = require('mongoose');
const _ = require('lodash');

/**
 * Ajv validator instance.
 */
const validator = new Ajv({
    removeAdditional: 'all',
    useDefaults: true,
    coerceTypes: 'array'
});

/**
 * Non empty text format.
 */
validator.addFormat('text', (val) => { return _.isString(val) && !/^\s+$/i.test(val) });


/**
 * ObjectId
 */
validator.addFormat('objectId', (val) => mongoose.Types.ObjectId.isValid(val));


/**
 * Validate given object for given JSON schema.
 * @param {object} obj test object
 * @param {object} schema JSON schema
 * @throws {Error} INVALID_INPUT error if object is not as per given.
 */
module.exports = function validate(obj, schema) {
    const validate = validator.compile(schema);

    const valid = validate(obj);
    if (valid) {
        return
    } else {
        const msg = _.capitalize(validate.errors[0].message);
        const path = _.trimStart(validate.errors[0].dataPath, '.');
        const val = path ? _.get(obj, path) : '';
        throw errors.INVALID_INPUT(`${msg}${path ? `, at: ${path}` : ''}${val ? `, found: ${val}` : ''}`);
    }
}