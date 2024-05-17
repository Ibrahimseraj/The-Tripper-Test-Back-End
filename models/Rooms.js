const mongoose = require("mongoose");
const joi = require("joi");


const roomSchema = new mongoose.Schema({
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hotel',
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
    title: {
      type: String,
      required: true,
      trim: true
    },
    bathRoom: {
      type: [String],
      tirm: true
    },
    bedType: {
      type: String,
      trim: true
    },
    foodAndDrinks: {
      type: [String],
      tirm: true
    },
    roomAmenities: {
      type: [String],
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    roomSize: {
      type: Number,
      required: true,
      trim: true
    },
    adults: {
      type: Number,
      required: true,
      trim: true
    },
    childern: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    airConditioning: {
      type: Boolean,
      required: true,
      default: false
    },
    wifi: {
      type: Boolean,
      required: true,
      default: false
    },
    smoking: {
      type: Boolean,
      required: true,
      default: false
    },
    numberOfRooms: {
      type: Number,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    currentReservation: [],
  }, {
    timestamps: true
});


const Rooms = mongoose.model('Rooms', roomSchema);


const addRoomsValidation = (obj) => {
    const schema = joi.object({
        title: joi.string().trim().required(),
        bathRoom: joi.string().trim().required(),
        bedRoom: joi.string().trim().required(),
        description: joi.string().trim().required(),
        roomSize: joi.number().trim().required(),
        bedType: joi.string().trim().required(),
        adults: joi.number().required(),
        childern: joi.number(),
        price: joi.number().required(), 
        isAvailable: joi.bool(),
    })

    return schema.validate(obj);
}


const updateRoomsValidation = (obj) => {
    const schema = joi.object({
        title: joi.string().trim(),
        bathRoom: joi.string().trim(),
        bedRoom: joi.string().trim(),
        description: joi.string().trim(),
        roomSize: joi.number().trim(),
        bedType: joi.string().trim(),
        adults: joi.number(),
        numberOfRooms: joi.number(),
        childern: joi.number(),
        price: joi.number(),
        isAvailable: joi.bool(),
    })

    return schema.validate(obj);
}


module.exports = { Rooms, addRoomsValidation, updateRoomsValidation }