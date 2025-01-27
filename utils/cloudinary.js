//const router = require("express").Router();
const cloudinary = require("cloudinary");
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

exports.uploads = (file, folder) => {
    return new Promise(resolve => {
        cloudinary.uploader.upload(file, (result) => {
            console.log(result)
            resolve({
                url: result.url,
                public_id: result.public_id
            })
        }, {
            resource_type: "auto",
            folder: folder
        })
    })
}