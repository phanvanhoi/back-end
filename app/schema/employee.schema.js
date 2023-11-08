const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  birthday: Joi.date(),
  sex: Joi.string().valid("nam", "nữ").required(),
  roleId: Joi.string().required(),
  companyId: Joi.string().required(),
});

const updateSchema = Joi.object({
  employeeId: Joi.string().required(),
  name: Joi.string().min(1),
  roleId: Joi.string(),
  birthday: Joi.date(),
  companyId: Joi.string(),
  sex: Joi.string().valid("nam", "nữ"),
});

const EmployeeSchema = {
  createSchema: createSchema,
  updateSchema: updateSchema,
};
module.exports = EmployeeSchema;
