const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const ReviewModel = require('../../database/reviews/review');
const UserModel = require('../../database/user/user')

//validation
const { ValidationSignUp, ValidationSignIn } = require('../../Validation/auth');

const Router = express.Router();

Router.post("/new", passport.authenticate("jwt", { session: false }), async (req, res) => {

    try {

        const formData = req.body;
        const { rest_id, user_id } = req.query;
        const reviewData = {
            ratings: formData.ratings,
            reviewText: formData.reviewText,
        }
        if (formData.reviewType === 'Food') {
            reviewData.isFood = true,
                reviewData.isRestaurant = false
        } else {
            reviewData.isFood = false,
                reviewData.isRestaurant = true
        }

        const ReviewData = await ReviewModel.findOneAndUpdate({ restaurant: rest_id, user: user_id }, { $push: { review: { $each: [reviewData] } } }, { new: true })

        if (ReviewData === null) {

            const ReviewData = await ReviewModel.create({
                restaurant: rest_id,
                user: user_id,
                review: [reviewData]
            });
            return res.json({ ReviewData });
        }

        return res.json({ ReviewData });
    }
    catch (error) {
        return res.status(500).json({ error: error.mesage });
    }
});

Router.get('/all/:rest_id', async (req, res) => {

    try {

        const { rest_id } = req.params;

        const ReviewData = await ReviewModel.aggregate([

            {
                $match: { restaurant: new mongoose.Types.ObjectId(rest_id) }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user"

            },


        ])

        if (ReviewData.length === 0) {
            return res.status(404).json({ error: "Review not found" });
        }

        return res.status(200).json({ ReviewData });
    }
    catch (err) {
        return res.status(500).json({ error: err.mesage });
    }
});

// Router.delete("/delete/:_id", async(req, res)=> {

//     try{

//         const {_id} = req.params;

//         await ReviewModel.findByIdAndDelete(_id);

//         return res.json({message: "Successfully Deleted review"});
//     }
//     catch(error){
//         return res.status(500).json({error: error.message});
//     }
// });

module.exports = Router;