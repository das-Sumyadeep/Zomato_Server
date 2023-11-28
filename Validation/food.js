const joi = require('joi');

const ValidationRestId = (restId) => {

    const Schema = joi.object({
        _id: joi.string().required()
    });

    return Schema.validateAsync(restId);
};

const ValidationCategory = (category) => {

    const Schema = joi.object({
        category: joi.string().required()
    });

    return Schema.validateAsync(category);
};


module.exports = {ValidationRestId, ValidationCategory}