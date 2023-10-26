const db = require("../models");
const TypeFashion = db.typeFashion;

// Create and Save a new Contract
exports.create = (req, res) => {
  const { name = "" } = req.body;
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }

  // Create a TypeFashion
  const typeFashion = new TypeFashion({
    name,
  });

  // Save Contract in the database
  TypeFashion.create(typeFashion)
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
  TypeFashion.find()
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
