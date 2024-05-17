const router = require("express").Router();
const { verifyHotelUserToken, verifyHotelUserTokenAuthorization } = require("../middlewares/verifyHoteluserToken");
const { verifyToken } = require("../middlewares/verifyToken")
const { getHotelsCtrl, getHotelsByIdCtrl, updateHotelCtrl, deleteHotelCtrl, addHotelsss, getHotelsCityCtrl, searchHotels, getRoomsFromsRoomsArr, getGoodPrice, getGoodPrices, getCurrentReservationsss, deletedHotelImagesByIdsCtrl, postRatingCtrl } = require("../controllers/hotlescontroller");
const validateObjectId = require("../middlewares/validateObjectId");
const photoUpload = require("../middlewares/imageUpload");



//  /hotel/get
router.route("/get").get(getHotelsCtrl);


//  /hotel/get/good/price
router.route("/get/good/price").get(getGoodPrice);


//  /hotel/get/bad/price
router.route("/get/bad/price").get(getGoodPrices);


//  /hotel/hotels/:hotelId/reservations
router.route("/hotels/:hotelId/reservations").get(verifyHotelUserToken, getCurrentReservationsss);


//  /hotel/get/:id
router.route("/get/:id").get(validateObjectId, getHotelsByIdCtrl);


//  /hotel/:city
router.route("/:city").get(getHotelsCityCtrl);


//  /hotel/city/:city
router.route("/city/:city").get(searchHotels);


//  /hotel/room/:id
router.route('/room/:id').get(getRoomsFromsRoomsArr);


// /hotel/auth/register
router.route("/post").post(verifyHotelUserToken, photoUpload.array("images"), addHotelsss);


router.route("/rating/:id").post(validateObjectId, verifyToken, postRatingCtrl)


// /hotel/edit/:id
router.route("/edit/:id").put(validateObjectId, verifyHotelUserToken, photoUpload.array("images"), updateHotelCtrl);


// /hotel/delete/:id
router.route("/delete/:id").delete(validateObjectId, verifyHotelUserTokenAuthorization, deleteHotelCtrl);


router.route("/:id/images/:public_id").delete(deletedHotelImagesByIdsCtrl);


module.exports = router;