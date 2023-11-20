const db = require("../models");
const { typeFashion: TypeFashion, item: Item } = db;

const { typeFashion } = require("../schema/index");
const { createSchema } = typeFashion;

// Create and Save a new Contract
exports.create = (req, res) => {
  const validate = createSchema.validate(req.body);

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
    .then(async (data) => {
      const dataConvert = await Promise.all(
        await data.map(async (value) => {
          const doc = value._doc;
          const itemIds = doc.items.split(",");
          const items = await Item.find({ _id: { $in: itemIds } }).exec();
          return {
            ...doc,
            items,
          };
        })
      );

      res.send(dataConvert);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.getOptions = (req, res) => {
  TypeFashion.find()
    .then(async (data) => {
      const dataConvert = await Promise.all(
        await data.map(async (value) => {
          const doc = value._doc;
          return {
            label: doc.name,
            value: doc._id,
          };
        })
      );

      res.send(dataConvert);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.deleteFashioneType = (req, res) => {
  TypeFashion.findOneAndDelete(req.body)
    .then(async (data) => {
      res.send({ message: "Delete fashion type success" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.updateById = (req, res) => {
  const typeFashionId = req.params.id;

  if (!typeFashionId) {
    res.status(422).send({ message: "typeFashionId is require" });
    return;
  }

  TypeFashion.findOneAndUpdate({ _id: typeFashionId }, req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
