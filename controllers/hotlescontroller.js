asyncHandler = require("express-async-handler");
const { Hotels, updateHotelValidation, addHotelValidation } = require("../models/Hotels");
const { Rooms } = require("../models/Rooms");
require("dotenv").config();
const cloudinary = require("../utils/cloudinary");
const { cloudinaryRemoveImage } = require("../utils/removeImageFromCloudinary");
const fs = require("fs");




/**
* @desc get rooms
* @route /hotel/get
* @method GET
* @access public
*/
module.exports.getHotelsCtrl = asyncHandler(
  async (req, res) => {
    try {
      const hotel = await Hotels.find();

      res.status(200).json(hotel);
    } catch (error) {
      console.log(error);
    }
  }
);



/**
* @desc get rooms
* @route /hotel/get
* @method GET
* @access public
*/
module.exports.getHotelsCityCtrl= asyncHandler(
  async (req, res) => {
    try {
      const { city } = req.params;
      const { minPrice, sort } = req.query;
  
      let query = { city: city };
      if (minPrice) {
        query.cheapestPrice = { $gte: minPrice };
      }
  
      const sortOption = sort === 'desc' ? -1 : 1;
  
      const hotels = await Hotels.find(query).sort({ cheapestPrice: sortOption });
      res.json(hotels);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  }
);



/**
* @desc get rooms
* @route /hotel/get
* @method GET
* @access public
*/
module.exports.getRoomsFromsRoomsArr = asyncHandler(
  async (req, res) => {
    const hotel = await Hotels.findById(req.params.id);

    const roomsList = await Promise.all(
      hotel.rooms.map((room) => {
        return Rooms.findById(room)
      })
    )

    res.status(200).json(roomsList);
  }
);


module.exports.getGoodPrice = asyncHandler(async (req, res) => {
  const sort = req.query.sort === 'desc' ? -1 : 1;

  try {
    const hotels = await Hotels.find().sort({ cheapestPrice: sort }).exec();
    res.send(hotels);
  } catch (err) {
    res.status(500).send('Error retrieving hotels');
  }
});




module.exports.getGoodPrices = asyncHandler(async (req, res) => {
  const sort = req.query.sort === 'desc' ? -1 : 1;

  try {
    const hotels = await Hotels.find().sort({ cheapestPrice: -sort }).exec();
    res.send(hotels);
  } catch (err) {
    res.status(500).send('Error retrieving hotels');
  }
});



/**
* @desc get rooms
* @route /hotel/get
* @method GET
* @access public
*/
module.exports.searchHotels = async (req, res) => {
  const { city } = req.params;
  try {
    const hotels = await Hotels.find({ city: { $regex: city, $options: "i" } });

    if (hotels.length > 0) {
      res.json(hotels);
    } else {
      res.status(404).json({ message: "No hotels found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};





module.exports.getCurrentReservationsss = asyncHandler(
  async (req, res) => {
    const { hotelId } = req.params;

    try {
      const hotel = await Hotels.findById(hotelId).populate({
        path: 'currentReservation',
        populate: {
          path: 'room',
          model: 'Rooms'
        }
      });

      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      res.status(200).json(hotel.currentReservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);


/**
* @desc get hotel by id
* @route /hotel/get/:id
* @method GET
* @access public
*/
module.exports.getHotelsByIdCtrl = asyncHandler(
  async (req, res) => {
    const result = await Hotels.findById(req.params.id).populate("user");

    if (result) {
      res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "Hotel does not found, you can look for other options" });
    }
  }
);



/**
* @desc adding new hotel
* @route /hotel/post
* @method POST
* @access public
*/
module.exports.addHotelsss = asyncHandler(async (req, res) => {
  try {
    const userId = req.hotelUser.hotelUserId;

    const existingPost = await Hotels.findOne({ hotelUser: userId });

    if (existingPost) {
      return res.status(403).json({ message: 'You have already made a post.' });
    }

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
      return res.status(405).json({ err: `${req.method} method not allowed` });
    }

    const popularAmenities = JSON.parse(req.body.popularAmenities);


    const hotel = new Hotels({
      hotelUser: userId,
      images: photos,
      hotelName: req.body.hotelName,
      popularAmenities: popularAmenities,
      description: req.body.description,
      refundable: req.body.refundable,
      FeesAndPolicies: req.body.FeesAndPolicies,
      roomAmenities: req.body.roomAmenities,
      aboutThisProperty: req.body.aboutThisProperty,
      address: req.body.address,
      rooms: req.body.rooms,
      cheapestPrice: req.body.cheapestPrice,
      city: req.body.city,
      checkInhour:req.body.checkInhour,
      checkOuthour:req.body.checkOuthour,
      stars: req.body.stars
    });

    const hotels = await hotel.save();
    res.status(201).json(hotels);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports.getRatings = asyncHandler(
  async (req, res) => {
    try {
      const hotel = await Hotels.findById(req.params.id);
  
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      const ratings = hotel.ratings;
      const averageRating = hotel.averageRating;
  
      res.status(200).json({ ratings, averageRating });
    } catch (error) {
      console.error('Error retrieving ratings:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);



module.exports.postRatingCtrl = asyncHandler(
  async (req, res) => {
    try {
      const hotel = await Hotels.findById(req.params.id);
  
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }
  
      const { user, rating, comment } = req.body;
      const userId = req.user.userId;
  
      hotel.ratings.push({ user: userId, rating, comment });
  
      const totalRatings = hotel.ratings.length;
      const sumRatings = hotel.ratings.reduce((acc, curr) => acc + curr.rating, 0);
      const averageRating = sumRatings / totalRatings;
  
      hotel.averageRating = averageRating;
  
      await hotel.save();
  
      res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
      console.error('Error adding rating:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);




/**
* @desc update hotel
* @route /hotel/edit/:id
* @method PUT
* @access private (only hotel user can)
*/
module.exports.updateHotelCtrl = asyncHandler(
  async (req, res) => {
    try {
    const postedHotel = await Hotels.findById(req.params.id);

    if (!postedHotel) {
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

        if (req.body.deletedImages && Array.isArray(req.body.deletedImages)) {

          const deletedHotelImagesByIdsCtrl = req.body.deletedImages;
  
          postedHotel.images = postedHotel.images.filter(image => !deletedHotelImagesByIdsCtrl.includes(image.public_id));
  
          for (const deletedId of deletedHotelImagesByIdsCtrl) {

            await cloudinary.deleteImage(deletedId);
          }
        }
      } 
    } else {
      return res.status(405).json({ error: `${req.method} method not allowed` });
    }


    const result = await Hotels.findByIdAndUpdate(req.params.id, {
      $set: {
        images: [...postedHotel.images, ...photos],
        hotelName: req.body.hotelName,
        popularAmenities: req.body.popularAmenities,
        description: req.body.description,
        refundable: req.body.refundable,
        FeesAndPolicies: req.body.FeesAndPolicies,
        roomAmenities: req.body.roomAmenities,
        aboutThisProperty: req.body.aboutThisProperty,
        address: req.body.address,
        rooms: req.body.rooms,
        checkInhour:req.body.checkInhour,
        checkOuthour:req.body.checkOuthour,
        cheapestPrice: req.body.cheapestPrice
      }
    }, { new: true });

  
    res.status(200).json(result);
    } catch(error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  }
);



/**
* @desc delete hotel
* @route /hotel/delete/:id
* @method delete
* @access private (only hotel user and admin can)
*/
module.exports.deletedHotelImagesByIdsCtrl = asyncHandler(async (req, res) => {
  try {
    const hotelId = req.params.id;
    const publicId = req.params.public_id;

    const hotel = await Hotels.findById(hotelId);

    if (!hotel) {
      return res.status(404).json({ message: 'hotel not found' });
    }

    const imageIndex = hotel.images.findIndex(image => image.public_id === publicId);

    if (imageIndex === -1) {
      return res.status(404).json({ message: 'Image not found' });
    }

    await cloudinaryRemoveImage(publicId);

    hotel.images.splice(imageIndex, 1);

    await hotel.save();

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



/**
* @desc delete hotel
* @route /hotel/delete/:id
* @method delete
* @access private (only hotel user and admin can)
*/
module.exports.deleteHotelCtrl = asyncHandler(
  async (req, res) => {
    const hotel = await Hotels.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const publicIds = hotel.images.map(image => image.public_id);
    const deleteResults = await cloudinary.api.delete_resources(publicIds);

    await hotel.remove();

    res.status(200).json({ message: "Hotel successfully deleted" });
  }
);