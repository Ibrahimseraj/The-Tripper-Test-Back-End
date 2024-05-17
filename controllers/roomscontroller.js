asyncHandler = require("express-async-handler");
const { Rooms, addRoomsValidation, updateRoomsValidation } = require("../models/Rooms");
const path = require("path");
const cloudinary = require("../utils/cloudinary");
const { cloudinaryRemoveImage } = require("../utils/removeImageFromCloudinary");
const fs = require("fs");
const { Hotels } = require("../models/Hotels");




/** 
* @desc get all rooms
* @route /room/get
* @method GET
* @access private (only user him self)
*/
module.exports.getAllRooms = asyncHandler(
  async (req, res) => {
    const result = await Rooms.find();

    res.status(200).json(result)
  }
)



/** 
* @desc get rooms by id
* @route /room/get/:id
* @method GET
* @access private (only user him self)
*/
module.exports.getRoomsById = asyncHandler(
  async (req, res) => {
    const result = await Rooms.findById(req.params.id).populate('images');

    if (result) {
      res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "room does not found, you can look for other options" });
    }
  }
);



/** 
 * @desc add room
 * @route /room/post/:hotelid
 * @method POST
 * @access private (only user him self)
*/
module.exports.addRoom = asyncHandler(async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  const urls = [];
  let photos = [];
  if (req.method === 'POST') {
    const files = req.files;

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);

      photos = urls.map(url => {
        return {
          url: url.url,
          public_id: url.public_id.split("/")[1]
        };
      });
    }
  } else {
    return res.status(405).json({ error: `${req.method} method not allowed` });
  }

  const hotelId = req.params.hotelid;

    const newRoom = new Rooms({
      images: photos,
      title: req.body.title,
      bathRoom: req.body.bathRoom,
      bedType: req.body.bedType,
      description: req.body.description,
      roomSize: req.body.roomSize,
      foodAndDrinks: req.body.bedType,
      roomAmenities: req.body.bedType,
      adults: req.body.adults,
      childern: req.body.childern,
      numberOfRooms: req.body.numberOfRooms,
      price: req.body.price,
      airConditioning: req.body.airConditioning,
      wifi: req.body.wifi,
      smoking: req.body.smoking,
      isAvailable: req.body.isAvailable,
    });
  
    try {
      const savedRooms = await newRoom.save();
      const updatedHotel = await Hotels.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRooms._id, }
      }, { new: true });
    
      if (!updatedHotel) {
        return res.status(404).json({ error: 'Hotel not found' });
      }
    
      res.status(200).json(savedRooms);
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: 'Server error' });
    }
});



/**
* @desc update room
* @route /room/edit/:id
* @method PUT
* @access private (only user him self)
*/
module.exports.updateRoomCtrl = asyncHandler(async (req, res) => {
  try {
    const postedRoom = await Rooms.findById(req.params.id);

    if (!postedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    const uploader = async (path) => await cloudinary.uploads(path, 'Images');
    const urls = [];
    let photos = [];

    if (req.method === 'PUT') {
      const files = req.files;

      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);

        photos.push({
          url: newPath.url,
          public_id: newPath.public_id.split("/")[1]
        });
      }

      if (req.body.deletedImages && Array.isArray(req.body.deletedImages)) {

        const deletedImageIds = req.body.deletedImages;

        postedRoom.images = postedRoom.images.filter(image => !deletedImageIds.includes(image.public_id));

        for (const deletedId of deletedImageIds) {

          await cloudinary.deleteImage(deletedId);
        }
      }

      const result = await Rooms.findByIdAndUpdate(req.params.id, {
        $set: {
          images: [...postedRoom.images, ...photos],
          title: req.body.title,
          bathRoom: req.body.bathRoom,
          description: req.body.description,
          roomSize: req.body.roomSize,
          foodAndDrinks: req.body.bedType,
          adults: req.body.adults,
          childern: req.body.childern,
          numberOfRooms: req.body.numberOfRooms,
          isAvailable: req.body.isAvailable,
          price: req.body.price,
          airConditioning: req.body.airConditioning,
          wifi: req.body.wifi,
          smoking: req.body.smoking,
          isAvailable: req.body.isAvailable
        }
      }, { new: true });

      res.status(200).json(result);
    } else {
      return res.status(405).json({ error: `${req.method} method not allowed` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



/**
* @desc delete room
* @route /room/:id/images/:public_id
* @method delete
* @access private (only hotel user or admin)
*/
module.exports.deletedImageIds = asyncHandler(async (req, res) => {
  try {
    const roomId = req.params.id;
    const publicId = req.params.public_id;

    const room = await Rooms.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const imageIndex = room.images.findIndex(image => image.public_id === publicId);

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await cloudinaryRemoveImage(publicId);

    room.images.splice(imageIndex, 1);

    await room.save();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



/**
* @desc delete room
* @route /room/delete/:id/:hotelid
* @method delete
* @access private (only hotel user or admin)
*/
module.exports.deleteRoom = asyncHandler(async (req, res) => {
  const hotelId = req.params.hotelid;
  const roomId = req.params.id;

  try {
    const room = await Rooms.findByIdAndDelete(roomId);

    for (const image of room.images) {
      await cloudinary.deleteImage(image.public_id);
    }

    try {
      await Hotels.findByIdAndUpdate(hotelId, {
        $pull: { rooms: roomId }
      });
    } catch (error) {
      console.error(error);
    }

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    return res.status(400).json(error);
  }
});