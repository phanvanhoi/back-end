const db = require("../models");
const Role = db.role;
const { roleSchema } = require("../schema/index");
const { createSchema, updateByListIdSchema } = roleSchema;
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
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.getAll = (req, res) => {
  Role.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.updateByNames = (req, res) => {
  const { names = [], value = {} } = req.body;
  const validate = updateByListIdSchema.validate(req.body);
  if (validate.error) {
    const { message } = validate.error;
    res.status(422).send({ message });
    return;
  }

  Role.updateMany({ name: names }, [{ $set: value }])
    .then((data) => {
      res.send({ message: "Updating successed!" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
