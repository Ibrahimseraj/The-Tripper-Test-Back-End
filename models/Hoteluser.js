const mongoose = require('mongoose');
const joi = require('joi');


const HotelUserShecma = new mongoose.Schema({
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

const HotelUser = mongoose.model("HotelUser", HotelUserShecma);

const validateHotelUser = (obj) => {
    const shcema = joi.object({
        email: joi.string().min(5).max(100).trim().required,
        password: joi.string().min(3).max(100).trim().required,
        isAdmin: joi.bool()
    })

    return shcema.validate(obj);
}

const validateUpdateHotelUser = (obj) => {
    const shcema = joi.object({
        email: joi.string().min(5).max(100).trim(),
        password: joi.string().min(3).max(100).trim()
    })

    return shcema.validate(obj);
}

const validateLoginHotelUser = (obj) => {
    const shcema = joi.object({
        email: joi.string().min(5).max(100).trim().required,
        password: joi.string().min(3).max(100).trim().required
    })

    return shcema.validate(obj);
}

module.exports = { HotelUser, validateHotelUser, validateUpdateHotelUser, validateLoginHotelUser }