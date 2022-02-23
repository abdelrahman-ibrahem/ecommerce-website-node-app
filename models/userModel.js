const mongoose = require('mongoose');
const Validator = require('validator');
const bcrypt = require('bcrypt');


// user schema
const userSchema = new mongoose.Schema({
    first_name :{
        type: String,
        required: [true , 'the first name is required'],
        minlength: 3,
        maxlength: 30
    },
    last_name: {
        type: String,
        required: [true , 'the last name is required'],
        minlength: 3,
        maxlength: 30
    },
    username: {
        type: String,
        required: [true , 'the username is required'],
        minlength: 3,
        maxlength: 30,
        unique: true
    },
    email:{
        type: String,
        required: [true , 'the Email is required'],
        validate: [Validator.isEmail , 'please enter the valid Email'],
        unique: true
    },
    password: {
        type: String,
        required: [true , 'the Password is required'],
    },
    passwordConfirm: {
        type: String,
        required: [true , 'the Password confirm is required'],
        validate: {
            validator: function(v){
                return v === this.password
            },
            message: "please enter the valid password confirm"
        }
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    photo: {
        type: String,
        default: 'default.png'
    },
    address: {
        type: String,
        required: [true , 'the address is required']
    }
});

// hashed password
userSchema.pre('save' , async function(next){
    if (!this.isModified) return next();
    this.password = await bcrypt.hash(this.password , 10);
    this.passwordConfirm = undefined;
    next();
});

// create user model
const User = mongoose.model('User' , userSchema);
module.exports = User;