const db = require("../models");
const { item: Item } = db;
const { itemSchema } = require("../schema/index");
const { createSchema } = itemSchema;

// Create and Save a new Contract
exports.create = async (req, res) => {
  const validate = createSchema.validate(req.body);
  // Validate request
  if (validate.error) {
    const { message } = validate.error;
    res.status(422).send({ message });
    return;
  }

  // Create a Item
  const item = new Item({
    ...req.body,
  });

  // Save Item in the database
  Item.create(item)
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
  Item.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
exports.deleteItem = (req, res) => {
  const itemId = req.params.id;
  Item.deleteOne({ _id: itemId })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
