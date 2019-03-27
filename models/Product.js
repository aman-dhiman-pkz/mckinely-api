const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Types = Schema.Types;

// State schema
const productSchema = new Schema({
    "productcategory": { type: Types.String, required: true, trim: true },
    "productsubcategory": { type: Types.String, required: true, trim: true },
    "productname": { type: Types.String, required: true, trim: true },
    "productcost": { type: Types.String, required: true, trim: true },
    "productsizes": { type: Types.String, required: true, trim: true },
    "image": { type: [Types.String], required: true, trim: true },
});


/**
 * State model
 */
module.exports = mongoose.model('Product', productSchema);
