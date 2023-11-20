const db = require("../models");
const Role = db.role;
const { roleSchema } = require("../schema/index");
const { createSchema, updateByListIdSchema } = roleSchema;
// Create and Save a new Contract
exports.create = async (req, res) => {
  if (Array.isArray(req.body)) {
    const roles = [];
    req.body.map((value) => {
      const validate = createSchema.validate(value);
      // Validate request
      if (validate.error) {
        const { message } = validate.error;
        res.status(422).send({ message });
        return;
      }
      roles.push(value);
    });

    const result = await Promise.all(
      roles.map(async (role) => {
        return await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true, new: true });
      })
    );
    res.send(result);
  } else {
    res.send({ message: "Params must be a array" });
  }
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
