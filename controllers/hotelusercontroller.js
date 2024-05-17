const asyncHandler = require("express-async-handler");
const { HotelUser, validateUpdateHotelUser } = require("../models/Hoteluser");
const { Hotels } = require("../models/Hotels");
const bcrypt = require("bcryptjs");



/**
 * @desc get all users
 * @route /profile/:id
 * @method GET
 * @access private only admin
*/
module.exports.getHotelUserCtrl = asyncHandler(
    async (req, res) => {
        const result = await HotelUser.find().select("-password");
        res.status(200).json(result);
    }
);



module.exports.getHotelUserWithPostsCtrl = asyncHandler(async (req, res) => {
    const hotels = await Hotels.find({ hotelUser: req.hotelUser.hotelUserId }).select('-password');
    res.status(200).json(hotels);
});



/**
 * @desc get user by id
 * @route /profile/:id
 * @method GET
 * @access public
*/
module.exports.getByIdHotelUserCtrl = asyncHandler(
    async (req, res) => {
        const result  = await HotelUser.findById(req.params.id).select("-password");

        if (!result) {
            return res.status(404).json({ message: "user not found" });
        }

        res.status(200).json(result);
    }
);


/**
* @desc update user
* @route /profile/:id
* @method PUT
* @access private 
*/
module.exports.updateHotelUserCtrl = asyncHandler(
    async (req, res) => {
        const { error } = validateUpdateHotelUser(req.body);
    
        if (error) {
            return res.status(404).json({ message: error.details[0].message });
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(req.body.password, salt);
        }
    
        const result = await HotelUser.findByIdAndUpdate(req.params.id, {
                $set: {
                    email: req.body.email,
                    password: hashedPassword
                }
        }, { new: true }).select("-password");
    
        res.status(200).json(result);
    }
);



/**
* @desc delete user
* @route /profile/:id
* @method delete
* @access private
*/
module.exports.deleteHotelUserCtrl = asyncHandler(
 async (req, res) => {
        const result = await HotelUser.findById(req.params.id);

        if (result) {
            await HotelUser.findByIdAndDelete(result);
            res.status(200).json({ message: 'your porfile Deleted Sucssfully' });
        } else {
            res.status(404).json({ message: 'Not Found' })
        }
 }
);