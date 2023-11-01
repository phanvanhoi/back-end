const Joi = require("joi");

const createSchema = Joi.object({
  employeeId: Joi.string().required(),
  contractId: Joi.string().required(),
  itemId: Joi.string().required(),
  number: Joi.number().required(),
  totalPrice: Joi.number(),
  lock: Joi.boolean().default(false),
});

const createByTypeFashionSchema = Joi.object({
  contractId: Joi.string().required(),
  typeFashionId: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      id: Joi.string().required(),
      number: Joi.number().required(),
    })
  ).required(),
});

const updateSchema = Joi.object({});

const EmployeeSchema = {
  createSchema,
  updateSchema,
  createByTypeFashionSchema,
};
module.exports = EmployeeSchema;
