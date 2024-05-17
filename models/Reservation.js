const mongoose = require('mongoose');
const joi = require("joi");




const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotels',
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rooms',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  adults: {
    type: Number,
    required: true
  },
  childern: {
    type: Number
  },
  totalDays: {
    type: Number
  },
  totalPrice: {
    type: Number,
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  cancellationDate: {
    type: Date
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
    tirm: true
  }
}, {
  timestamps: true
});


const Reservation = mongoose.model('Reservation', ReservationSchema);


function validateReservationall(obj) {
  const schema = joi.object({
    hotel: joi.string().required(),
    room: joi.string().required(),
    checkInDate: joi.date().required(),
    checkOutDate: joi.date().required(),
    adults: joi.number().integer().min(1).required(),
    childern: joi.number().integer().min(0).required(),
    email: joi.string().required().trim(),
    firstName: joi.string().required().trim(),
    lastName: joi.string().required().trim(),
    country: joi.string().required().trim(),
    phoneNumber: joi.number().required(),
    totalDays: joi.number(),
    totalPrice: joi.number()
  });

  return schema.validate(obj);
}



function validateReservationUpdate(obj) {
  const schema = joi.object({
    numberOfGuests: joi.number()
  });
  
  return schema.validate(obj);
}


module.exports = { Reservation, validateReservationall, validateReservationUpdate }
