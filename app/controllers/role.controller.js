const db = require("../models");
const Role = db.role;
const { roleSchema } = require("../schema/index");
const { createSchema } = roleSchema;
// Create and Save a new Contract
exports.create = (req, res) => {
  const validate = createSchema.validate(req.body);
  // Validate request
  if (validate.error) {
    const { message } = validate.error;
    res.status(422).send({ message });
    return;
  }

  // Create a Role
  const role = new Role({
    ...req.body,
  });

  // Save Role in the database
  Role.create(role)
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

exports.getAll = (req, res) => {
  // phanvanhoi.dtu@gmail.com
  // phanhoi1997
  Role.find()
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
