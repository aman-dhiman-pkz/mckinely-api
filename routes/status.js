const route = require('../lib/route');

/**
 * @apiGroup info
 * 
 * @api {get} /status Get API status
 * 
 * @apiSuccess (200) {string} status Status info
 * 
 */
module.exports = route.get('/', async (req, res) => {
    res.json({ status: 'online' });
});