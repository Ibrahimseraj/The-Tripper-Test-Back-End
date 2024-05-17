const cloudinary = require("cloudinary");
require("dotenv");
const router = require("express").Router();
require("dotenv");
const photoUpload = require("../middlewares/imageUpload"); 
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require("multer");
const path = require("path");
asyncHandler = require("express-async-handler");


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


module.exports.cloudinaryRemoveImage = async (imagePublicId) => {
    try {
        const result = await cloudinary.uploader.destroy(imagePublicId);
        return result;
    } catch(error) {
        return error;
    }
}