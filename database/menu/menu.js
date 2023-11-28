const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({

    restaurant: {
        type: mongoose.Types.ObjectId,
        ref: "Restaurants"
    },
    menu: [
        {
            category: {type: String, required: true},
            items: [
                {
                    type: mongoose.Types.ObjectId,
                    ref: 'Foods'
                }
            ]
        }
    ]
}, {timestamps: true});

const MenuModel = mongoose.model("Menus", MenuSchema);

module.exports = MenuModel