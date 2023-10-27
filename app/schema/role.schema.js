const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
});
const updateByListIdSchema = Joi.object({
  names: Joi.array().required(),
  value: Joi.object().required(),
});

const updateSchema = Joi.object({});

const RoleSchema = {
  createSchema,
  updateSchema,
  updateByListIdSchema,
};
module.exports = RoleSchema;
