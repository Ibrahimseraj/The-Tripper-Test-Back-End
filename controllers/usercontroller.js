const asyncHandler = require("express-async-handler");
const { User, validateUpdateUser } = require("../models/User");
const bcrypt = require("bcryptjs");



/**
 * @desc get all users
 * @route /user/:id
 * @method GET
 * @access private only admin
 */
module.exports.getUserCtrl = asyncHandler(
    async (req, res) => {
        const result = await User.find().select("-password");
        res.status(200).json(result);
    }
);



/**
 * @desc get user by id
 * @route /user/:id
 * @method GET
 * @access public
 */
module.exports.getByIdUserCtrl = asyncHandler(
    async (req, res) => {
        const result  = await User.findById(req.params.id).select("-password");

        if (!result) {
            return res.status(404).json({ message: "user not found" });
        }

        res.status(200).json(result);
    }
);



/**
* @desc update user
* @route /user/:id
* @method PUT
* @access private 
*/
module.exports.updateUserCtrl = asyncHandler(
    async (req, res) => {
        const { error } = validateUpdateUser(req.body);
    
        if (error) {
            return res.status(404).json({ message: error.details[0].message });
        }

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }
    
        const result = await User.findByIdAndUpdate(req.params.id, {
                $set: {
                    email: req.body.email,
                    password: req.body.password
                }
        }, { new: true }).select("-password");
    
        res.status(200).json(result);
    }
);



/**
* @desc delete user
* @route /user/:id
* @method delete
* @access private
*/
module.exports.deleteUserCtrl = asyncHandler(
 async (req, res) => {
        const result = await User.findById(req.params.id);

        if (result) {
            await User.findByIdAndDelete(result);
            res.status(200).json({ message: 'your porfile Deleted Sucssfully' });
        } else {
            res.status(404).json({ message: 'Not Found' })
        }
 }
);