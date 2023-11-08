const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  columns: Joi.number().required(),
});

const updateSchema = Joi.object({});

const ItemSchema = {
  createSchema,
  updateSchema,
};
module.exports = ItemSchema;
