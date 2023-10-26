const { ObjectId } = require("mongodb");
const db = require("../models");
const Employee = db.employee;
const { employeeSchema } = require("../schema/index");
const { createSchema, updateSchema } = employeeSchema;

// Create and Save a new Contract
exports.getAll = (req, res) => {
  Employee.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.create = (req, res) => {
  const { name = "", role = "", sex = "", companyId = undefined } = req.body;
  // Validate request
  const Joi = require("joi");

  const createSchema1 = Joi.object({
    name: Joi.string().required(),
    role: Joi.string().required(),
    birthday: Joi.date(),
    companyId: Joi.string().required(),
    sex: Joi.string().valid("nam", "nữ").required(),
  });

  const result = createSchema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    res.status(422).send({ message });
    return;
  }

  // Create a Employee
  const employee = new Employee({
    ...req.body,
  });

  // Save Contract in the database
  Employee.create(employee)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.update = (req, res) => {
  const employeeId = req.params.id;

  const result = updateSchema.validate({ ...req.body, employeeId });

  if (result.error) {
    const { message } = result.error;
    res.status(422).send({ message });
    return;
  }

  // Save Contract in the database
  Employee.findOneAndUpdate({ _id: employeeId }, { ...req.body })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Contract.",
      });
    });
};
