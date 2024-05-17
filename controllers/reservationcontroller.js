const asyncHandler = require("express-async-handler");
const { Reservation, validateReservationall, validateReservationUpdate } = require("../models/Reservation");
const moment = require('moment');
const { getDatesBetweenDates } = require('../utils/getDatesBetweenDates');
const stripe = require("stripe")('sk_test_51O2cmlB5cMjPZqGmrMrQeUL335a36LJfHYMlilVTV5ICiMd0SngjQzuOzRCc5MgQFd8lvX6EuAlHqcBvST5CrJDA00dIeU1pQj');
const { v4: uuidv4 } = require("uuid");
const { Hotels } = require('../models/Hotels');
const { Rooms } = require('../models/Rooms');
const sendEmail = require("../utils/removeImageFromCloudinary");
const nodemailer = require('nodemailer');



/**
* @desc get all room
* @route /reservation/get
* @method GET
* @access private (only user him self)
*/
module.exports.getReservation = asyncHandler(
  async (req, res) => {
    try {
      const userId = req.user.userId;
    
      const userReservations = await Reservation.find({ user: userId })
      .populate('hotel')
      .populate('room');
    
      res.status(200).send(userReservations);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  }
);


module.exports.getReservationDetails = asyncHandler(async (req, res) => {
  try {
    const reservationId = req.params.id;
    
    const reservation = await Reservation.findOne({ _id: reservationId, user: req.user.userId })
      .populate('hotel')
      .populate('room');

    if (!reservation) {
      return res.status(404).send('Reservation not found');
    }

    res.status(200).send(reservation);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});



module.exports.getHotelReservations = asyncHandler(async (req, res) => {
  try {
    const hotelId = req.params.hotelId;

    const hotelReservations = await Reservation.find({ hotel: hotelId }).populate('user');

    res.status(200).send(hotelReservations);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server error');
  }
});



/**
 * @desc book a room
 * @route /reservation/post
 * @method POST
 * @access private (only user himself)
 */
module.exports.postReservation = asyncHandler(async (req, res) => {
  const { error } = validateReservationall(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  let { hotel, room, checkInDate, checkOutDate, adults, childern, email, firstName, lastName, country, phoneNumber, totalDays, totalPrice } = req.body;

  const startDate = new Date(checkInDate);
  const endDate = new Date(checkOutDate);

  totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

  const roomInfo = await Rooms.findById(room).populate('hotel');

  const roomPrice = roomInfo.price;
  totalPrice = roomPrice * totalDays;


  if (!roomInfo) {
    return res.status(400).json({ message: "Room not found" });
  }

  if (!roomInfo.isAvailable) {
    return res.status(400).json({ message: "Room is not currently available for reservations" });
  }

  const availableAdultSpots = roomInfo.adults;
  const availableChildSpots = roomInfo.childern;

  if (adults > availableAdultSpots) {
    return res.status(400).json({ message: "Not enough adult spots available for the reservation" });
  }

  if (childern > availableChildSpots) {
    return res.status(400).json({ message: "Not enough child spots available for the reservation" });
  }

  const availableRooms = await Rooms.findOne({ _id: room, numberOfRooms: { $gte: 1 } });

  if (!availableRooms) {
    return res.status(400).json({ message: "Room is sold out" });
  }

  if (availableRooms.numberOfRooms < 1) {
    return res.status(400).json({ message: "No more rooms available for reservation" });
  }

  const userId = req.user.userId;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: 'usd',
    description: 'Reservation Payment',
  });

  const clientSecret = paymentIntent.client_secret;

    if (!req.body.paymentConfirmation) {
    return res.status(400).json({ message: "Payment is required" });
  }

  const { paymentConfirmation } = req.body;

  // Verify the payment confirmation or token with Stripe
  const payment = await stripe.paymentIntents.retrieve(paymentConfirmation);

  if (payment.status !== 'succeeded') {
    return res.status(400).json({ message: "Payment failed or not completed" });
  }

  const reservation = new Reservation({
    user: userId,
    hotel,
    room,
    checkInDate,
    checkOutDate,
    adults,
    childern,
    email,
    firstName,
    lastName,
    country,
    phoneNumber,
    totalDays,
    totalPrice
  });

  const reservationBody = await reservation.save();

  await Rooms.findOneAndUpdate(
    { _id: room, numberOfRooms: { $gte: 1 } },
    { $inc: { numberOfRooms: -1 } }
  );

  await Hotels.findOneAndUpdate(
    { _id: hotel },
    { $push: { currentReservation: reservationBody } }
  );

  await sendEmail(
    reservationBody.email, 
    `
    Check In Date: ${checkInDate}
    Check Out Date: ${checkOutDate}
    Adults: ${adults}
    Childern: ${childern}
    Total days: ${totalDays}
    Total price: ${totalPrice} US Dollar
    country: ${country}
    
    ${firstName} Thank you for choosing The Tripper!
    `,

    );

  res.status(201).send(reservationBody);
});


/**
 * @desc payment intent conformation
 * @route /
 * @method POST
 * @access public
 */
module.exports.postPaymentCtrl = asyncHandler(
  async (req, res) => {
    const { paymentMethodId } = req.body;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
      amount: AMOUNT_IN_CENTS,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
    });

    // Process the paymentIntent and handle the result
    if (paymentIntent.status === 'succeeded') {
      // Payment succeeded, update your database, etc.
      res.json({ success: true });
    } else {
      // Payment failed or not completed
      res.status(400).json({ error: 'Payment failed or not completed' });
    }
   } catch (error) {
    // Handle error
    res.status(500).json({ error: 'An error occurred' });
   }
  }
)



/**
* @desc add room
* @route /reservation/post
* @method PUT
* @access private (only user him self)
*/
module.exports.updateReservation = asyncHandler(
  async (req, res) => {
    try {
      const reservationId = req.params.id;
      const { checkInDate, checkOutDate } = req.body;
  
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        console.log(`Reservation ${reservationId} not found`);
        return res.status(400).send(`Reservation ${reservationId} not found`);
      }
  
      const existingReservation = await Reservation.findOne({
        room: reservation.room,
        roomNumber: reservation.roomNumber,
        $or: [
          { checkInDate: { $lte: checkInDate }, checkOutDate: { $gt: checkInDate } },
          { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gte: checkOutDate } },
          { checkInDate: { $gte: checkInDate }, checkOutDate: { $lte: checkOutDate } },
        ],
      });
      if (existingReservation && existingReservation._id.toString() !== reservationId) {
        console.log(`Room ${reservation.roomNumber} is already assigned to a reservation for the requested dates`);
        return res.status(400).send(`Room ${reservation.roomNumber} is already assigned to a reservation for the requested dates`);
      }
  
      // Calculate the new total price for the reservation
      const roomDoc = await Rooms.findById(reservation.room);
      const price = roomDoc.price;
      const numberOfNights = Math.ceil((new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24));
      const totalPrice = price * numberOfNights;
  
      reservation.checkInDate = checkInDate;
      reservation.checkOutDate = checkOutDate;
      reservation.totalPrice = totalPrice;
      await reservation.save();
  
      const roomNumberDoc = roomDoc.roomNumbers.find((roomNumberObj) => roomNumberObj.number === reservation.roomNumber);
      if (!roomNumberDoc) {
        console.log(`Room ${reservation.roomNumber} not found in the requested room`);
        return res.status(400).send(`Room ${reservation.roomNumber} not found in the requested room`);
      }
      const oldReservationDates = getDatesBetweenDates(reservation.checkInDate, reservation.checkOutDate);
      const newReservationDates = getDatesBetweenDates(checkInDate, checkOutDate);
      roomNumberDoc.unavailableDates = roomNumberDoc.unavailableDates.filter((date) => !oldReservationDates.includes(date));
      roomNumberDoc.unavailableDates.push(...newReservationDates);
      await roomDoc.save();
  
      io.to(roomDoc._id.toString()).emit('currentReservationsUpdated', { currentReservations: roomDoc.currentReservation });
  
      const userId = req.user.userId;
      const userReservations = await Reservation.find({ user: userId });
  
      res.status(200).send(userReservations);
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
  }
);




/**
* @desc delete reservation
* @route /reservation/delete
* @method delete
* @access private (only user him self)
*/
module.exports.deleteReservation = asyncHandler(
    async (req, res) => {
      try {
        const reservationId = req.params.id;
    
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
          console.log(`Reservation ${reservationId} not found`);
          return res.status(400).send(`Reservation ${reservationId} not found`);
        }
    
        const roomDoc = await Rooms.findOne({ _id: reservation.room });
        if (!roomDoc) {
          console.log(`Room ${reservation.room} not found`);
          return res.status(400).send(`Room ${reservation.room} not found`);
        }
        roomDoc.currentReservation = roomDoc.currentReservation.filter((r) => r._id.toString() !== reservationId);
        const roomNumberDoc = roomDoc.roomNumbers.find((roomNumberObj) => roomNumberObj.number === reservation.roomNumber);
        if (!roomNumberDoc) {
          console.log(`Room ${reservation.roomNumber} not found in the requested room`);
          return res.status(400).send(`Room ${reservation.roomNumber} not found in the requested room`);
        }
        const reservationDates = getDatesBetweenDates(reservation.checkInDate, reservation.checkOutDate);
        roomNumberDoc.unavailableDates = roomNumberDoc.unavailableDates.filter((date) => !reservationDates.includes(date));
        await roomDoc.save();
    
        await Reservation.findByIdAndDelete(reservationId);
    
        const userId = req.user.userId;
        const userReservations = await Reservation.find({ user: userId });
    
        res.status(200).send(userReservations);
      } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
      }
    }
);




