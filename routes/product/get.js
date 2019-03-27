const route = require('../../lib/route');

/**
 * @apiGroup Product
 * 
 * 
 */

module.exports = route.get('/products', async (req, res) => {

    res.json({ 'msg': 'get ROute' });
});