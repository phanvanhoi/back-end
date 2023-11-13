const db = require("../models");
const { company: Company, image: Image, setTypeFashion: SetTypeFashion } = db;
const { companySchema } = require("../schema/index");
const { createSchema, updateSchema } = companySchema;
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
  const company = new Company(req.body);

  // Save Contract in the database
  Company.create(company)
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
