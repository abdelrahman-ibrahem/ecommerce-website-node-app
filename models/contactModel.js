const mongoose = require('mongoose');
const Validator = require('validator');

const contactSChema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , 'the name is required'],
        minlength: 3,
        maxlength: 40
    },
    email: {
        type: String,
        required: [true , 'The email is required.'],
        validate: [Validator.isEmail , 'please enter valid email'],
    },
    phone:{
        type: String,
        required: [true , 'The telephone number is required'],
    },
    message: {
        type: String,
        required: [true , 'The message is required']
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Contact = mongoose.model('Contact', contactSChema);
module.exports = Contact;