const router = require("express").Router();
const { getHotelUserCtrl, getHotelUserWithPostsCtrl, getByIdHotelUserCtrl, updateHotelUserCtrl, deleteHotelUserCtrl } = require("../controllers/hotelusercontroller");
const { verifyHotelUserToken, verifyHotelUserTokenAndAdmin, verifyTokenHotelUser, verifyHotelUserTokenAuthorization } = require("../middlewares/verifyHoteluserToken");
const validateObjectId = require("../middlewares/validateObjectId");


// /hotel/profile/get
router.route("/get").get(verifyHotelUserTokenAndAdmin, getHotelUserCtrl);



router.route("/").get(verifyHotelUserToken, getHotelUserWithPostsCtrl);


// /hotel/profile/:id
router.route("/get/:id").get(validateObjectId, verifyHotelUserTokenAndAdmin, getByIdHotelUserCtrl);


// /hotel/profile/edit/:id
router.route("/edit/:id").put(validateObjectId, verifyTokenHotelUser, updateHotelUserCtrl);


// /hotel/profile/delete/:id
router.route("/delete/:id").delete(validateObjectId, verifyHotelUserTokenAuthorization, deleteHotelUserCtrl);


module.exports = router;