const route = require('../../lib/route');
const Product = require('../../models/Product');

/**
 * @apiGroup Product
 * 
 * 
 */

module.exports = route.get('/products', async (req, res) => {

    // TODO : Add pagination in it

    const products = await Product.find({}).lean();

    res.json(products);
});