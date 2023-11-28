const express = require('express');

const FoodModel = require('../../database/food/food');

// validation
const { ValidationRestId, ValidationCategory } = require('../../Validation/food');

const Router = express.Router();

// get all foods according to restaurants id

Router.get('/:id', async(req, res)=> {

    try{
        await ValidationRestId(req.params);

        const {_id} = req.params;
        const foods = await FoodModel.find({restaurant: _id});
        
        return res.status(200).json({foods});
        
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});


// get all foods according to category

Router.get('/foods/:category', async(req, res)=> {

    try{
        await ValidationCategory(req.params);

        const {category} = req.params;
        const foods = await FoodModel.find({category});
        
        return res.status(200).json({foods});

    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

Router.post('/new', async(req, res)=> {

    try{

        const {newFood} = req.body;
        const foods = await FoodModel.create(newFood);
        
        return res.status(200).json({foods});
        
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

module.exports = Router;