const express = require('express');
const mongoose = require('mongoose');

const MenuModel = require('../../database/menu/menu');

const Router = express.Router();

Router.get('/:_id', async (req, res) => {

    try {

        const { _id } = req.params;

        const MenuData = await MenuModel.aggregate([
            {
                $match: { restaurant: new mongoose.Types.ObjectId(_id) }
            },
            {
                $unwind: "$menu"
            },
            {
                $lookup: {
                    from: "foods",
                    localField: "menu.items",
                    foreignField: "_id",
                    as: "menu.items"
                }
            },
            {
                $group: {
                    _id: "$_id",
                    menu: { $push: "$menu" }
                }
            }
        ]);


        if (MenuData.length === 0) {
            return res.status(404).json({ error: "Menu not found" });
        }

        return res.status(200).json({ MenuData });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

Router.post('/newMenu/:_id', async (req, res) => {

    try {

        const { newMenu } = req.body;
        const { _id } = req.params;

        const MenuDoc = await MenuModel.findOneAndUpdate({ restaurant: _id }, { $push: { menu: { $each: [newMenu] } } });

        if (MenuDoc === null) {

            await MenuModel.create({
                restaurant: _id,
                menu: [newMenu]
            })
            return res.status(201).json({ message: "Successfully added" });
        }
        return res.status(200).json({ message: "Successfully added" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
});


Router.post('/newItem', async (req, res) => {

    try {

        const { newItem } = req.body;
        const { _id, category } = req.query;

        const ItemDoc = await MenuModel.findOneAndUpdate({ restaurant: _id, 'menu.category': category }, { $push: { 'menu.$.items': { $each: [newItem] } } });

        if (!ItemDoc) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        return res.status(200).json({ message: "Successfully added" });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});




module.exports = Router;