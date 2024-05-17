const jwt = require("jsonwebtoken");
require("dotenv");



//verifyToken
function verifyHotelUserToken(req, res, next)  {
    const authToken = req.headers.authorization;

    if (authToken) {
        const token = authToken.split(" ")[1];
        try {
            const decodedPayload = jwt.verify(token, process.env.hotel_SECRET_CODE);
            req.hotelUser = decodedPayload;
            next();
        } catch (error) {
            return res.status(401).json({ message: "invaild token, access denied" })
        }
    } else {
        return res.status(401).json({ message: "you should Login fist" })
    }
}


//verifyToken & Admin
function verifyHotelUserTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.hotelUser.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed, only admin allowed" });
        }
    });
}


//verifytoken & only user himself
function verifyTokenHotelUser(req, res, next) {
    verifyToken(req, res, () => {
        if (req.hotelUser.hotelUserId === req.params.id) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed, only user allowed" });
        }
    });
}


//verifytoken & Authorization
function verifyHotelUserTokenAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.hotelUser.hotelUserId === req.params.id || req.hotelUser.isAdmin) {
            next();
        } else {
            return res.status(403).json({ message: "you are not allowed, only user or admin allowed" });
        }
    });
}


module.exports = { verifyHotelUserToken, verifyHotelUserTokenAndAdmin, verifyTokenHotelUser, verifyHotelUserTokenAuthorization }