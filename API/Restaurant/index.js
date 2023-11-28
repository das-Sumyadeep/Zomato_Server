const express = require('express');
const mongoose = require('mongoose');

const RestaurantModel = require('../../database/restaurant/restau');
const ImageModel = require('../../database/image/image');

// Validation
const { ValidateRestaurantCity, ValidateRestaurantSearchString } = require('../../Validation/restaurant');
const { ValidationRestId } = require('../../Validation/food');

const Router = express.Router();

Router.post("/new", async (req, res) => {

    try {

        const { restaurantData } = req.body;

        restaurantData.city = restaurantData.city.toLowerCase();

        await RestaurantModel.create(restaurantData);

        return res.json({ message: "Successfully Created" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

Router.get("/all", async (req, res) => {

    try {
        await ValidateRestaurantCity(req.query);

        const { city } = req.query;

        const RestData = await RestaurantModel.aggregate([
            {
                $match: {
                    "city": { $eq: city }
                }
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "restaurant",
                    as: "images"
                }
            },
            {
                $unwind: "$images"
            }
        ]);


        if (RestData.length === 0) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        return res.status(200).json({ RestData });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


Router.get("/:_id", async (req, res) => {

    try {
        await ValidationRestId(req.params);

        const { _id } = req.params;

        const RestData = await RestaurantModel.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(_id) }
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "restaurant",
                    as: "images"
                }
            },
            {
                $unwind: "$images"
            },
            {
                $lookup: {
                    from: "menuimages",
                    localField: "_id",
                    foreignField: "restaurant",
                    as: "menuImages"
                }
            },
            {
                $unwind: "$menuImages"
            }
        ]);

        if (RestData.length === 0) {
            return res.status(404).json({ error: "Restaurant not found" });
        }

        return res.status(200).json({ RestData });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

Router.get("/search/:searchString/:city", async (req, res) => {

    try {
        await ValidateRestaurantSearchString(req.params);

        const { searchString, city } = req.params;

        const restaurants = await RestaurantModel.aggregate([
            {
                $match: {
                    "city": { $eq: city }
                }
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: searchString, $options: "i" } },
                        { popularDishes: { $in: [new RegExp(searchString, "i")] } },
                        { cuisine: { $in: [new RegExp(searchString, "i")] } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "restaurant",
                    as: "images"
                }
            },
            {
                $unwind: "$images" // If there can be multiple images per restaurant
            }
            // Additional stages if needed
        ]);

        if (restaurants.length === 0) {
            return res.status(404).json({ error: "Oops!" });
        }

        return res.status(200).json({ restaurants });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = Router;