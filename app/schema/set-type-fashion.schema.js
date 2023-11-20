const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  typeFashionIds: Joi.string().required(),
});

const updateSchema = Joi.object({});

const SetTypeFashionSchema = {
  createSchema: createSchema,
  updateSchema: updateSchema,
};
module.exports = SetTypeFashionSchema;
