const route = require('../../lib/route');
const validate = require('../../lib/validate');
const Product = require('../../models/Product');
const errors = require('../../errors');

/**
 * @apiGroup Product
 * 
 * 
 */

module.exports = route.post('/products', async (req, res) => {

    // validate body
    validate(req.body, {
        'properties': {
            'productcategory': { type: 'string', format: 'text', minLength: 1, maxLength: 100 },
            'productsubcategory': { type: 'string', format: 'text', minLength: 1, maxLength: 100 },
            'productname': { type: 'string', format: 'text', minLength: 1, maxLength: 100 },
            'productcost': { type: 'string', format: 'text' },
            'productsizes': { type: 'string', format: 'text', minLength: 1, maxLength: 100 },
            'image': {
                type: 'array',
                items: {
                    type: 'string',
                    format: 'objectId'
                }
            },
        },
        required: ['productcategory', 'productsubcategory', 'productname', 'productcost', 'productsizes', 'image']
    });

    let product;
    try {
        product = await Product.create(req.body);
    } catch (err) {
        throw errors.SOMETHING_WENT_WRONG('Error in user creation')
    }

    res.json({ product });
});