const Joi = require("joi");

// id: ObjectId,
// name: String,
// phoneNumber: String,
// Fax: String,
// Tax: String,
// bankNumber: String,
// representPerson: String,
// role: String,
// image: Binary,
const createSchema = Joi.object({
  name: Joi.string().required(),
  phoneNumber: Joi.string().regex(/^[0-9]{11}$/),
  Fax: Joi.string(),
  Tax: Joi.string(),
  bankNumber: Joi.string(),
  representPerson: Joi.string(),
  role: Joi.string(),
  image: Joi.object({
    name: Joi.string().required(),
    imageUrl: Joi.string().required(),
  }),
});

const updateSchema = Joi.object({
  id: Joi.string().required(),
  name: Joi.string(),
  phoneNumber: Joi.string().regex(/^[0-9]{11}$/),
  Fax: Joi.string(),
  Tax: Joi.string(),
  bankNumber: Joi.string(),
  representPerson: Joi.string(),
  role: Joi.string(),
  image: Joi.object({
    name: Joi.string().required(),
    imageUrl: Joi.string().required(),
  }),
});

const companySchema = {
  createSchema: createSchema,
  updateSchema: updateSchema,
};
module.exports = companySchema;
