const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({  
        title: Joi.string().required(),
        price: Joi.number().required().min(1),  
        description: Joi.string().required(),
        location: Joi.string().required(),  
        country: Joi.string().required(),
        image: Joi.string().required(),
    }).required(),
});