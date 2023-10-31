const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  items: Joi.string().required(),
});

const updateSchema = Joi.object({
});

const TypeFashionSchema = {
  createSchema: createSchema,
  updateSchema: updateSchema,
};
module.exports = TypeFashionSchema;
