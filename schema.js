const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            'any.required': 'Title is required!',
            'string.empty': 'Title cannot be empty!'
        }),
        description: Joi.string().required().messages({
            'any.required': 'Description is required!',
            'string.empty': 'Description cannot be empty!'
        }),
        location: Joi.string().required().messages({
            'any.required': 'Location is required!',
            'string.empty': 'Location cannot be empty!'
        }),
        country: Joi.string().required().messages({
            'any.required': 'Country is required!',
            'string.empty': 'Country cannot be empty!'
        }),
        price: Joi.number().required().min(0).messages({
            'any.required': 'Price is required!',
            'number.min': 'Price cannot be negative!',
            'number.base': 'Price must be a number!'
        }),
        image: Joi.string().allow("", null).messages({
            'string.empty': 'Image URL cannot be empty!',
        })
    }).required().messages({
        'object.base': 'Listing must be a valid object!',
    })
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5).messages({
            'any.required': 'Rating is required!',
            'number.min': 'Rating must be at least 1!',
            'number.max': 'Rating must be at most 5!',
        }),
        comment: Joi.string().required().messages({
            'any.required': 'Comment is required!',
            'string.empty': 'Comment cannot be empty!',
        })
    }).required().messages({
        'object.base': 'Review must be a valid object!',
    })
});
