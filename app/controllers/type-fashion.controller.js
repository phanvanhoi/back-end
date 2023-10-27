const db = require("../models");
const TypeFashion = db.typeFashion;

const { typeFashion } = require("../schema/index");
const { createSchema } = typeFashion;

// Create and Save a new Contract
exports.create = (req, res) => {
  const validate = createSchema.validate();

  if (validate.error) {
    const { message } = validate.error;
    res.status(422).send({ message });
    return;
  }

  // Create a TypeFashion
  const typeFashion = new TypeFashion({
    ...req.body,
  });

  // Save Contract in the database
  TypeFashion.create(typeFashion)
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
  TypeFashion.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

