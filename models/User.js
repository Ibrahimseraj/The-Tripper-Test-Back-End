const mongoose = require('mongoose');
const joi = require('joi');


const UserShecma = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 5,
        maxlength: 100
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
});

const User = mongoose.model("User", UserShecma);

const validateUser = (obj) => {
    const shcema = joi.object({
        email: joi.string().min(5).max(100).trim().required,
        password: joi.string().min(3).max(100).trim().required,
        isAdmin: joi.bool()
    })

    return shcema.validate(obj);
}

const validateUpdateUser = (obj) => {
    const shcema = joi.object({
        email: joi.string().min(5).max(100).trim(),
        password: joi.string().min(3).max(100).trim()
    })

    return shcema.validate(obj);
}

const validateLoginUser = (obj) => {
    const shcema = joi.object({
        email: joi.string().min(5).max(100).trim().required,
        password: joi.string().min(3).max(100).trim().required
    })

    return shcema.validate(obj);
}

module.exports = { User, validateUser, validateUpdateUser, validateLoginUser }