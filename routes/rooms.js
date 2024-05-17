const router = require("express").Router();
const { getAllRooms, getRoomNumberCtrl, getRoomsById, addRoom, updateRoomCtrl, deleteRoom, deletedImageIds } = require("../controllers/roomscontroller");
const { verifyHotelUserToken, verifyHotelUserTokenAuthorization } = require("../middlewares/verifyHoteluserToken");
const photoUpload = require("../middlewares/imageUpload");
const validateObjectId = require("../middlewares/validateObjectId");



// /room/get
router.route("/get").get(getAllRooms);


// /room/get/:id
router.route("/get/:id").get(validateObjectId, getRoomsById);


// /room/post/:hotelid
router.route("/post/:hotelid").post(verifyHotelUserToken, photoUpload.array("images"), addRoom);


// /room/edit/:id
router.route("/edit/:id").put(validateObjectId, verifyHotelUserToken, photoUpload.array("images"), updateRoomCtrl);


// /room/:id/images/:public_id
router.route("/:id/images/:public_id").delete(verifyHotelUserToken, deletedImageIds);


// /room/delete/:id/:hotelid
router.route("/delete/:id/:hotelid").delete(verifyHotelUserTokenAuthorization, deleteRoom);


module.exports = router;