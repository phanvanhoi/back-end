const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
});

const updateSchema = Joi.object({
});

const RoleSchema = {
  createSchema: createSchema,
  updateSchema: updateSchema,
};
module.exports = RoleSchema;
