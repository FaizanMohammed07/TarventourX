const Joi = require("joi");
const review = require("./models/review");
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country: Joi.string().required(),
    category: Joi.string()
      .valid("swimming", "arctic", "desert", "boats", "camping", "mountains")
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    comment: Joi.string().required(),
    rating: Joi.number().required().min(1).max(5),
  }).required(),
});
