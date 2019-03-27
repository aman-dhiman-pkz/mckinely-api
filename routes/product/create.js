const route = require('../../lib/route');
const validate = require('../../lib/validate');

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
    
    res.json({ 'body': { ...req.body } });
});