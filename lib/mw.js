const util = require('util');

/**
 * Midleware creator.
 * @param {function} handler middleware async function
 */
module.exports = (handler) => ((app) => app.use(util.callbackify(handler)));