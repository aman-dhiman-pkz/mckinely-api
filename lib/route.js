const util = require('util');

/**
 * Creates a route function that accpets app and mounts an async handler for route method and path.
 * @param {object} obj reduced object
 * @param {string} m method name
 */
function makeRouteFn(obj, m) {
    obj[m] = (path, handler) => ((app) => app[m](path, util.callbackify(handler)));
    return obj;
}

/**
 * Mount methods for express app.
 */
const METHODS = ['get', 'put', 'post', 'delete', 'options', 'use'];

/**
 * Route creator.
 * @type{{get:function,put:function,post:function,del:function,options:function,use:function}}
 */
module.exports = METHODS.reduce(makeRouteFn, {});