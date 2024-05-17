const router = require("express").Router();
const { getUserCtrl, getByIdUserCtrl, updateUserCtrl, deleteUserCtrl } = require("../controllers/usercontroller");
const { verifyToken, verifyTokenAndAdmin, verifyTokenUser, verifyTokenAuthorization } = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

// /user
router.route("/").get(verifyTokenAndAdmin, getUserCtrl);

// /user/:id
router.route("/:id").get(validateObjectId, verifyTokenAndAdmin, getByIdUserCtrl);

// /user/:id
router.route("/:id").put(validateObjectId, verifyTokenUser, updateUserCtrl);

// /user/:id
router.route("/:id").delete(validateObjectId, verifyTokenAuthorization, deleteUserCtrl);


module.exports = router;