const { ObjectId } = require("mongodb");
const db = require("../models");
const { sign: Sign, employee: Employee, contract: Contract, item: Item, typeFashion: TypeFashion, role: Role } = db;
const { signSchema } = require("../schema/index");
const { Promise } = require("mongoose");
const { createSchema, createByTypeFashionSchema } = signSchema;

exports.createByTypeFashion = async (req, res) => {
  const validate = createByTypeFashionSchema.validate(req.body);
  // Validate request
  if (validate.error) {
    const { message } = validate.error;
    res.status(422).send({ message });
    return;
  }

  const { contractId, typeFashionId, items = [] } = validate.value;

  try {
    const hasContract = await Contract.findOne({ _id: contractId }).exec();
    if (!hasContract) {
      res.status(422).send({ message: `Contract with id:"${contractId}" have not in the system` });
      return;
    }
    const hasTypeFashion = await TypeFashion.findOne({ _id: typeFashionId }).exec();
    if (!hasTypeFashion) {
      res.status(422).send({ message: `Item product with id:"${typeFashionId}" have not in the system` });
      return;
    }
    // Find list id of employee
    let Roles = [];
    Roles = await Role.find({ typeFashionId }).exec();
    const typeFashionIds = Roles.map((e) => {
      return e._id;
    });

    const Employees = await Employee.find({ $and: [{ contractId }, { roleId: { $in: typeFashionIds } }] }).exec();
    let objectConvert = [];

    Employees.map((em) => {
      items.map((value) => {
        const { id, number } = value;
        const sign = new Sign({
          contractId,
          itemId: id,
          employeeId: em._id,
          number,
        });
        objectConvert.push(sign);
      });
    });

    // Save Sign in the database
    Sign.insertMany(objectConvert)
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error occurred while creating the Contract.",
        });
      });
  } catch (error) {
    res.status(500).send({ message: `The system have some errors` });
    return;
  }
};

// Create and Save a new Contract
exports.create = async (req, res) => {
  const validate = createSchema.validate(req.body);
  // Validate request
  if (validate.error) {
    const { message } = validate.error;
    res.status(422).send({ message });
    return;
  }

  const { employeeId, contractId, itemId, number } = validate.value;
  let totalPrice = 0;

  try {
    const hasEmployee = await Employee.findOne({ _id: employeeId }).exec();
    if (!hasEmployee) {
      res.status(422).send({ message: `Employee with id:"${employeeId}" have not in the system` });
      return;
    }

    const hasContract = await Contract.findOne({ _id: contractId }).exec();
    if (!hasContract) {
      res.status(422).send({ message: `Contract with id:"${contractId}" have not in the system` });
      return;
    }
    const hasItem = await Item.findOne({ _id: itemId }).exec();
    if (!hasItem) {
      res.status(422).send({ message: `Item product with id:"${itemId}" have not in the system` });
      return;
    } else {
      totalPrice = number * hasItem.price;
    }
  } catch (error) {
    res.status(500).send({ message: `The system have some errors` });
    return;
  }

  const sign = new Sign({
    ...req.body,
    totalPrice,
  });

  // Save Sign in the database
  Sign.create(sign)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
