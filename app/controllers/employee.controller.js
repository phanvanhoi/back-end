/** @format */

const { ObjectId } = require("mongodb");
const db = require("../models");
const Employee = db.employee;
const Role = db.role;
const Company = db.company;
const { employeeSchema } = require("../schema/index");
const { createSchema, updateSchema } = employeeSchema;

exports.getAll = (req, res) => {
  Employee.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.create = async (req, res) => {
  // Validate request
  const result = createSchema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    res.status(422).send({ message });
    return;
  }

  // Create a Employee
  const { role, companyId } = req.body;

  const hasRole = await Role.findOne({ name: role }).exec();
  if (!hasRole) {
    res.status(422).send({ message: `"${role}" role have not in the system ` });
    return;
  }

  try {
    const hasCompany = await Company.findOne({ _id: companyId }).exec();
    if (!hasCompany) {
      res.status(422).send({ message: `"${companyId}" have not in the system` });
      return;
    }
  } catch (error) {
    res.status(422).send({ message: `"${companyId}" have not in the system` });
    return;
  }

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
        message: err.message || "Some error occurred while creating the Contract.",
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
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
