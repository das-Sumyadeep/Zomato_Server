const joi = require('joi');

const ValidateRestaurantCity = (restData) => {

    const Schema = joi.object({
        
        city: joi.string().required().lowercase()

    });

    return Schema.validateAsync(restData);
};

const ValidateRestaurantSearchString = (restData) =>{

    const Schema = joi.object({
        
        searchString: joi.string().required(),
        city: joi.string().required().lowercase()
    });

    return Schema.validateAsync(restData);
}

module.exports = {ValidateRestaurantCity, ValidateRestaurantSearchString}