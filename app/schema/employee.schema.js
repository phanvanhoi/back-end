const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  role: Joi.string().required(),
  birthday: Joi.date(),
  companyId: Joi.string().required(),
  sex: Joi.string().valid("nam", "nữ").required(),
});

const updateSchema = Joi.object({
  employeeId: Joi.string().required(),
  name: Joi.string().min(1),
  role: Joi.string(),
  birthday: Joi.date(),
  companyId: Joi.string(),
  sex: Joi.string().valid("nam", "nữ"),
});

const EmployeeSchema = {
  createSchema: createSchema,
  updateSchema: updateSchema,
};
module.exports = EmployeeSchema;
