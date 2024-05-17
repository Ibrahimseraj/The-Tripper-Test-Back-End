const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { HotelUser, validateHotelUser, validateLoginHotelUser } = require("../models/Hoteluser");



/**
 * @desc add hotel
 * @route /hotel/auth/register
 * @method POST
 * @access public
 */
module.exports.registerHotelUserCtrl = asyncHandler(
    async (req, res) => {
        const { err } = validateHotelUser(req.body);
        
        if (err) {
            return res.status(404).json({ message: err.details[0].message });
        }

        let hotelUser = await HotelUser.findOne({ email: req.body.email });

        if (hotelUser) {
            return res.status(400).json({ message: 'invalid email or password' })
        }

        const salt = await bcrypt.genSalt(10);

        hashedPassword = await bcrypt.hash(req.body.password, salt);
        
        hotelUser = new HotelUser({
            userName: req.body.userName,
            email: req.body.email,
            password: hashedPassword,
            isAdmin: req.body.isAdmin
        });
        
        const result = await hotelUser.save();
        
        res.status(201).json(result);
    }
);



/** 
* @desc login hotel
* @route /hotel/auth/login
* @method POST
* @access public
*/
module.exports.loginHotelUserCtrl = asyncHandler(
    async (req, res) => {
        const { err } = validateLoginHotelUser(req.body);
        
        if (err) {
            return res.status(400).json({ message: err.details[0].message });
        }
        
        const hotelUser = await HotelUser.findOne({ email: req.body.email });

        if (!hotelUser) {
            return res.status(400).json({ message: "invaild email or password" });
        }

        const isMatchPassword = await bcrypt.compare(req.body.password, hotelUser.password);

        if (!isMatchPassword) {
            res.status(400).json({ message: "invalid email or password" });
        }

        const token = jwt.sign({ hotelUserId: hotelUser._id, isAdmin: hotelUser.isAdmin}, process.env.hotel_SECRET_CODE);

        const { password, ...other } = hotelUser._doc;

        res.status(200).json({...other, token});
    }
);