const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({

    restaurant: { type: mongoose.Types.ObjectId, ref: "Restaurants" },
    user: { type: mongoose.Types.ObjectId, ref: "Users" },
    review: [
        {
            ratings: { type: Number, required: true },
            reviewText: { type: String, required: true },
            isFood: { type: Boolean, required: true },
            isRestaurant: { type: Boolean, required: true }
        }
    ]
}, { timestamps: true });

const ReviewModel = mongoose.model("Reviews", ReviewSchema);

module.exports =  ReviewModel