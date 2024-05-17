const router = require("express").Router();
const { registerHotelUserCtrl, loginHotelUserCtrl } = require("../controllers/hoteluserauthcontroller");

// hotel/auth/register
router.route("/register").post(registerHotelUserCtrl);


// /auth/login
router.route("/login").post(loginHotelUserCtrl);


module.exports = router;