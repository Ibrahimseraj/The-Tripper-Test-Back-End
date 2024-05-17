const router = require("express").Router();
const { registerUserCtrl, loginUserCtrl } = require("../controllers/authcontroller");



// /auth/register
router.route("/register").post(registerUserCtrl);


// /auth/login
router.route("/login").post(loginUserCtrl);


module.exports = router;