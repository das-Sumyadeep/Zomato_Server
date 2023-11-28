const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');

const OrderModel = require('../../database/order/order');

//validation
const { ValidationSignUp, ValidationSignIn } = require('../../Validation/auth');

const Router = express.Router();

Router.get("/:_id/:rest_id", passport.authenticate("jwt", { session: false }), async (req, res) => {

    try {
        const { _id, rest_id } = req.params;

        const getOrders = await OrderModel.aggregate([
            {
                $match: {
                    user: new mongoose.Types.ObjectId(_id),
                    restaurant: new mongoose.Types.ObjectId(rest_id),
                },
            },
            {
                $lookup: {
                    from: "foods",
                    localField: "food",
                    foreignField: "_id",
                    as: "foodDetails",
                },
            },
            {
                $unwind: '$foodDetails'
            },
            {
                $lookup: {
                    from: "restaurants",
                    localField: "restaurant",
                    foreignField: "_id",
                    as: "restDetails",
                },
            },
            {
                $unwind: '$restDetails'
            }

        ]);

        if (!getOrders) {
           
            return res.status(401).json({ order: getOrders });
        }

        return res.json({ order: getOrders });

    }
    catch (error) {
        
        return res.status(500).json({ message: "User Unauthorized" });
    }
});

Router.post("/new/:_id", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { _id } = req.params;
        const orderDetails = req.body;

        const { food, restaurant, quantity } = orderDetails;

        const updatedOrder = await OrderModel.findOne(
            {
                user: _id,
                food,
            }
        );

        if (!updatedOrder) {
            // If no order found, create a new order
            await OrderModel.create({
                user: _id,
                restaurant,
                food,
                quantity: Number(quantity),
            });

            return res.status(200).json({ order: "added" });
        }

        return res.status(200).json({ order: "updated" });

    } catch (error) {
        return res.status(500).json({ message: "User Unauthorized" });
    }
});


Router.put("/quantity/:_id/:type", async (req, res) => {
    try {
        const { _id, type } = req.params;
        // const { type } = req.body;

        // Find the order by _id
        const order = await OrderModel.findById(_id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Determine the increment or decrement based on the type
        let incrementValue = 0;
        if (type === '+') {
            incrementValue = order.quantity + 1;
        } else if (type === '-') {
            incrementValue = order.quantity > 1 ? order.quantity - 1 : 1;
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }

        // Update the quantity
        order.quantity = incrementValue;

        // Save the updated order
        await order.save();

        return res.status(200).json({ order: "updated" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


Router.delete("/delete/:_id", async (req, res) => {
    try {
        const { _id } = req.params;

        const order = await OrderModel.findByIdAndDelete(_id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json({ order: "deleted" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

Router.delete("/deleteOrders", async (req, res) => {
    try {
        const { user_id, rest_id } = req.query;

        const deleteResult = await OrderModel.deleteMany({ user: user_id, restaurant: rest_id });

        if (deleteResult.deletedCount > 0) {
            return res.status(200).json({ message: "Orders deleted successfully" });
        } else {
            return res.status(404).json({ error: "No matching orders found" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



module.exports = Router;