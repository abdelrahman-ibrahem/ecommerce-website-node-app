const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true , 'Please login first']
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    // quantity:{
    //     type: Number,
    //     required: [true , 'please Enter the quantity'],
    //     validate: {
    //         validator: function(v){
    //             return v > 0;
    //         },
    //         message: 'Enter the valid number'
    //     }
    // },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;