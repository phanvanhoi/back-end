const db = require("../models");
const { company: Company, image: Image, setTypeFashion: SetTypeFashion } = db;
const { setTypeFashion } = require("../schema/index");
const { createSchema } = setTypeFashion;
const { columnCharacters, getColumns } = require("../const/excel-column");
const { typeFashion: TypeFashion, item: Item, role: Role } = db;
const moment = require("moment");

const { handdleManyEmployee } = require("./employee.controller");

// Create and Save a new Contract
exports.create = (req, res) => {
  // Validate request
  const result = createSchema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    res.status(422).send({ message });
    return;
  }

  // Create a Company
  const setTypeFashion = new SetTypeFashion(req.body);

  // Save Contract in the database
  SetTypeFashion.create(setTypeFashion)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the fashion type.",
      });
    });
};

exports.updateById = (req, res) => {
  const setTypeFashionId = req.params.id;
  if (!setTypeFashionId) {
    res.status(422).send({ message: "setTypeFashionId is require" });
    return;
  }

  SetTypeFashion.findOneAndUpdate({ _id: setTypeFashionId }, req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.getOne = (req, res) => {
  const id = req.params.id;
  SetTypeFashion.findOne({ _id: id })
    .then(async (data) => {
      const { typeFashionIds = "" } = data;
      const ids = typeFashionIds.split(",");

      const typeFashionObj = await TypeFashion.find({ _id: { $in: ids } })
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

          return dataConvert;
        })
        .catch((err) => {
          return [];
        });

      res.send({ set: data, items: typeFashionObj });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.getAll = (req, res) => {
  SetTypeFashion.find()
    .then(async (data) => {
      const result = await Promise.all(
        data.map(async (obj) => {
          const { typeFashionIds = "" } = obj;
          const ids = typeFashionIds.split(",");

          const typeFashionObj = await TypeFashion.find({ _id: { $in: ids } })
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

              return dataConvert;
            })
            .catch((err) => {
              return [];
            });
          return { set: obj, items: typeFashionObj };
        })
      );

      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.deleteSetFashioneType = (req, res) => {
  SetTypeFashion.findOneAndDelete(req.body)
    .then(async (data) => {
      res.send({ message: "Delete fashion type success" });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.getOptions = (req, res) => {
  SetTypeFashion.find()
    .then(async (data) => {
      const result = await Promise.all(
        data.map(async (obj) => {
          return {
            value: obj.name,
            label: obj.name,
          };
        })
      );

      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
