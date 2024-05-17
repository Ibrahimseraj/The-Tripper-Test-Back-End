const router = require("express").Router();
const { postReservation, getReservation, getReservationDetails, deleteReservation, updateReservation, getHotelReservations } = require("../controllers/reservationcontroller");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyToken } = require("../middlewares/verifyToken");



// /reservation/get
router.route("/get").get(verifyToken, getReservation);


router.route("/get/:id").get(verifyToken, getReservationDetails);


router.route("/get/hotel").get(verifyToken, getHotelReservations);


// /reservation/post
router.route("/post").post(verifyToken, postReservation);


// /reservation/update/:id
router.route("/update/:id").put(verifyToken, updateReservation);


// /reservation/delete/:id
router.route("/delete/:id").delete(verifyToken, validateObjectId, deleteReservation);




module.exports = router;