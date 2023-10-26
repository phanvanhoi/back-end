const db = require("../models");
const Company = db.company;

// Create and Save a new Contract
exports.create = (req, res) => {
  const { name = "" } = req.body;
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "Name can not be empty!" });
    return;
  }

  // Create a Company
  const company = new Company({
    name,
  });

  // Save Contract in the database
  Company.create(company)
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

  Company.find()
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
