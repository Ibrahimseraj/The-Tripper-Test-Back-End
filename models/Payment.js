const mongoose = require('mongoose');
const joi = require("joi");




const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});


const Payment = mongoose.model('Payment', PaymentSchema);


function validatePayment(obj) {
  const schema = joi.object({

  });

  return schema.validate(obj);
}



function validatePaymentUpdate(obj) {
  const schema = joi.object({
    
  });
  
  return schema.validate(obj);
}


module.exports = { Payment, validatePayment, validatePaymentUpdate }


/*
module.exports.postReservation = asyncHandler(async (req, res) => {
  const { error } = validateReservationall(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  
  const { hotel, room, checkInDate, checkOutDate, adults, childern, email, firstName, lastName, country, phoneNumber } = req.body;

  // Find the room by hotel and room ID
  const roomInfo = await Rooms.findById(room).populate('hotel');

  if (!roomInfo) {
    return res.status(400).json({ message: "Room not found" });
  }

  // Check if the room is available for reservations
  if (!roomInfo.isAvailable) {
    return res.status(400).json({ message: "Room is not currently available for reservations" });
  }

  // Check if there are enough adult and child spots in the room for the given reservation
  const availableAdultSpots = roomInfo.adults;
  const availableChildSpots = roomInfo.childern;

  if (adults > availableAdultSpots) {
    return res.status(400).json({ message: "Not enough adult spots available for the reservation" });
  }

  if (childern > availableChildSpots) {
    return res.status(400).json({ message: "Not enough child spots available for the reservation" });
  }

  // Check if enough rooms are available for the given hotel and room ID
  const availableRooms = await Rooms.findOne({ _id: room, numberOfRooms: { $gte: 1 } });

  if (!availableRooms) {
    return res.status(400).json({ message: "Room is sold out" });
  }

  if (availableRooms.numberOfRooms < 1) {
    return res.status(400).json({ message: "No more rooms available for reservation" });
  }

  const userId = req.user.userId;

  // Create the reservation
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
    phoneNumber
  });

  const reservationBody = await reservation.save();

  // Calculate the number of days between check-in and check-out dates
  const checkInMoment = moment(checkInDate);
  const checkOutMoment = moment(checkOutDate);
  const numberOfDays = checkOutMoment.diff(checkInMoment, 'days');

  // Calculate the total price
  const roomPrice = roomInfo.price;
  const totalPrice = roomPrice * numberOfDays;

  // Set the total price in the reservation
  reservationBody.totalPrice = totalPrice;
  
  // Decrease the available number of rooms by 1
  await Rooms.findOneAndUpdate(
    { _id: room, numberOfRooms: { $gte: 1 } },
    { $inc: { numberOfRooms: -1 } }
  );

  // Push the reservation to the hotel's currentReservation array
  await Hotels.findOneAndUpdate(
    { _id: hotel },
    { $push: { currentReservation: reservationBody } }
  );

  // Send confirmation email
  const transporter = nodemailer.createTransport({
    // Configure the email transport options (e.g., SMTP or a service like Gmail)
    // See Nodemailer documentation for available options
    service: 'gmail',
    auth: {
      user: process.env.THE_TRIPPER_EMAIL,
      pass: process.env.THE_TRIPPER_PASSWORD
    }
  });

  const mailOptions = {
    from: 'udyibo6@gmail.com', // Sender's email address
    to: reservationBody.email, // Recipient's email address from the reservation
    subject: 'Reservation Confirmation', // Email subject
    text: `
      Check In Date: ${checkInDate}
      Check Out Date: ${checkOutDate}
      Adults: ${adults}
      Children: ${childern}
      Total Price: ${totalPrice}
      ` // Email body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent:', info.response);
  } catch (error) {
    console.error('Errorsending confirmation email:', error);
    // Handle the error and return an appropriate response to the client
    return res.status(500).json({ message: 'Failed to send confirmation email' });
  }

  res.status(201).send(reservationBody);
});
*/