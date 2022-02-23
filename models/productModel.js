const mongoose = require('mongoose');
const slugify = require('slugify');


const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true , 'Please login first']
    },
    name: {
        type: String,
        minlength: 3,
        maxlength: 40,
        required: [true , 'the name of the product is required']
    },
    slug: String,
    category :{
        type: String,
        enum: ['Electronic' , 'clothes', 'books']
    },
    image: {
        type: String,
    },
    description:{
        type: String,
        required: [true , 'the description is required field']
    },
    price:{
        type: Number,
        required: [true , 'the price is required field']
    },
    discount: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// create slug
productSchema.pre('save' , function(next){
    this.slug = slugify(this.name , {lower: true});
    next();
});

// create product model
const Product = mongoose.model('Product' , productSchema);

module.exports = Product;