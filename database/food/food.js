const mongoose = require('mongoose');

const FoodSchema = new mongoose.Schema({

    name: {type:String, required: true},
    isVeg: {type:Boolean, required: true},
    isNonVeg: {type: Boolean, required: true},
    category: {type:String, reuired:true},
    photos: {
        type: mongoose.Types.ObjectId,
        ref: "Images"
    },
    price: {type: Number, default: 150, required: true},
    desc: {type:String, reuired:true}
}, {timestamps: true});

const FoodModel = mongoose.model("Foods", FoodSchema);

module.exports = FoodModel