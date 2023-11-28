const express = require('express');
const passport = require('passport');

const UserModel = require('../../database/user/user');

const Router = express.Router();

Router.get("/:_id", async (req, res) => {

    try {

        const { _id } = req.params;

        const getUser = await UserModel.findById(_id);

        return res.json({ user: getUser });
    }
    catch (error) {
        return res.status(500).json({ error: error.mesage });
    }
});

Router.put("/update/:userId",passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { userId } = req.params;
        const { address } = req.body;
    
        const updatedUser = await UserModel.findByIdAndUpdate(
            { _id: userId },
            { $push: { address: { $each: [address] } } },
            { new: true }
        );

        return res.status(200).json({ user: updatedUser });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


module.exports = Router;