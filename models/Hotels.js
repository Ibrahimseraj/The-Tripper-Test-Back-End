const mongoose = require("mongoose");
const joi = require("joi");



const HotelsSchema = new mongoose.Schema({
    hotelUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HotelUser',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    rooms: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rooms',
        required: true
    },
    images: [{
        url: {
          type: String,
          required: true
        },
        public_id: {
          type: String,
          required: true
        }
    }],      
    hotelName: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    popularAmenities: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        icon: {
            type: String,
            required: true,
            trim: true
        },
        available: {
            type: Boolean,
            required: true,
            default: false
        }
    }],
    description: {
        type: String,
        trim: true
    },
    refundable: {
        type: Boolean,
        default: false
    },
    FeesAndPolicies: {
        type: String,
        trim: true
    },
    roomAmenities: {
        type: [String],
        trim: true
    },
    aboutThisProperty: {
        type: String,
        trim: true
    },
    address: {  
        type: String,
        required: true
    },
    rooms: {
        type: [String],
    },
    cheapestPrice: {
        type: Number,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
    },
    checkInhour:{
        type: String,
        required: true
    },
    checkOuthour:{
        type: String,
        required: true
    },
    averageRating: {
        type: Number,
        default: 0
    },
    ratings: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5
        },
        comment: {
          type: String,
          trim: true
        }
    }],
    currentReservation: []
}, {
    timestamps: true
});


const Hotels = mongoose.model("Hotels", HotelsSchema);


const addHotelValidation = (obj) => {
    const schema = joi.object({
        hotelName: joi.string().trim().min(2).max(100).required(),
        description: joi.string().trim().required(),
        refundable: joi.bool(),
        FeesAndPolicies: joi.string().trim(),
        aboutThisProperty: joi.string().trim(),
        address: joi.string().trim().required(),
        roomNumbers: joi.array().items(
            joi.object({
              number: joi.number().required(),
              checkAvailability: joi.array().items(joi.date())
            })
          ),
        cheapestPrice: joi.number().required(),
        city: joi.string().trim().required(),
        stars: joi.number().min(1).max(5)
    })

    return schema.validate(obj);
}


const updateHotelValidation = (obj) => {
    const schema = joi.object({
        hotelName: joi.string().trim().min(2).max(100),
        description: joi.string().trim(),
        refundable: joi.bool(),
        FeesAndPolicies: joi.string().trim(),
        aboutThisProperty: joi.string().trim(),
        address: joi.string().trim(),
        roomNumbers: joi.array().items(
            joi.object({
              number: joi.number(),
              checkAvailability: joi.array().items(joi.date())
            })
          ),
        cheapestPrice: joi.number(),
        city: joi.string().trim(),
        stars: joi.number().min(1).max(5)
    })

    return schema.validate(obj);
}


module.exports = { Hotels, addHotelValidation, updateHotelValidation }