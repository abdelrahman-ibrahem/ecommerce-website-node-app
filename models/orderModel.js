const mongoose = require('mongoose');
const Validator = require('validator');

const orderSchema = new mongoose.Schema({
    cart: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cart',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity:{
        type: Number,
        required: [true , 'please Enter the quantity'],
        validate: {
            validator: function(v){
                return v > 0;
            },
            message: 'Enter the valid number'
        }
    },
    name: {
        type: String,
        required: [true , 'The name is required'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true , 'The email is required'],
        validate: [Validator.isEmail , 'please enter valid email'],
    },
    address: {
        type: String,
        required: [true , 'The address is required']
    },
    size: {
        type: String,
        enum: ['m' , 'l' , 'x' , 'xl'],
        default: 'l'
    },
    payed:{
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: [true , 'the telephoe is required']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }

});


const Order = mongoose.model('Order' , orderSchema);
module.exports = Order;