const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({

    name: {type: String, required: true},
    city: {type: String, required: true},
    address: {type: String, required: true},
    // mapLocation: {type: String, required: true},
    cuisine : [String],
    // restaurantTimings: String,
    contactNumber: Number,
    popularDishes: [String],
    type: {type: String, required: true},
    photos: {type: mongoose.Types.ObjectId, ref: "Images"},
    menuImages: {type: mongoose.Types.ObjectId, ref: "MenuImages"},
    menus: {type: mongoose.Types.ObjectId, ref: "Menus"},
    reviews: {type: mongoose.Types.ObjectId, ref: "reviews"}

}, {timestamps: true});

const RestaurantModel = mongoose.model("Restaurants", RestaurantSchema);

module.exports = RestaurantModel;