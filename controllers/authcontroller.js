const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { User, validateUser, validateLoginUser } = require("../models/User");




/**
 * @desc add user
 * @route /auth/register
 * @method POST
 * @access public
*/
module.exports.registerUserCtrl = asyncHandler(
    async (req, res) => {
        const { err } = validateUser(req.body);
        
        if (err) {
            return res.status(404).json({ message: err.details[0].message });
        }

        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ message: 'invalid email or password' })
        }

        const salt = await bcrypt.genSalt(10);

        req.body.password = await bcrypt.hash(req.body.password, salt);
        
        user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
        });
        
        const result = await user.save();
               


        res.status(201).json(result);
});



/** 
* @desc login
* @route /auth/login
* @method POST
* @access public
*/
module.exports.loginUserCtrl = asyncHandler(
        async (req, res) => {
                const { err } = validateLoginUser(req.body);
        
                if (err) {
                        return res.status(400).json({ message: err.details[0].message });
                }
        
                const user = await User.findOne({ email: req.body.email });

                if (!user) {
                        return res.status(400).json({ message: "invaild email or password" });
                }

                const isMatchPassword = await bcrypt.compare(req.body.password, user.password);

                if (!isMatchPassword) {
                        res.status(400).json({ message: "invalied email or password" });
                    }

                    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin}, process.env.SECRET_CODE);

                    const { password, ...other } = user._doc;

                res.status(200).json({...other, token});
        }
);