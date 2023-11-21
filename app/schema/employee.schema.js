const Joi = require("joi");

const createSchema = Joi.object({
  name: Joi.string().required(),
  birthday: Joi.date(),
  sex: Joi.string().valid("nam", "nữ").required(),
  roleName: Joi.string().required(),
  companyId: Joi.string().required(),
  typeFashion: Joi.string().required(),
  numberPhone: Joi.string().required(),
  
});

const updateSchema = Joi.object({
  employeeId: Joi.string().required(),
  name: Joi.string().min(1),
  roleName: Joi.string(),
  birthday: Joi.date(),
  companyId: Joi.string(),
  numberPhone: Joi.string(),
  sex: Joi.string().valid("nam", "nữ"),
});

const EmployeeSchema = {
  createSchema: createSchema,
  updateSchema: updateSchema,
};
module.exports = EmployeeSchema;
