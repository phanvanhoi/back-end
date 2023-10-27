/** @format */
const db = require("../models");
const { employee: Employee, role: Role, company: Company, typeFashion: TypeFashion } = db;
const { employeeSchema } = require("../schema/index");
const { createSchema, updateSchema } = employeeSchema;

exports.getAll = (req, res) => {
  Employee.find()
    .then(async (data) => {
      const dataArr = data || [];
      const dataConvert = await Promise.all(
        dataArr.map(async (data) => {
          const { roleId, companyId } = data;
          const roleObj = await Role.findOne({ _id: roleId }).exec();
          let typeFashionObj = {};
          if (roleObj) {
            typeFashionObj = await TypeFashion.findOne({ _id: roleObj.typeFashionId }).exec();
          }

          const companyObj = await Company.findOne({ _id: companyId }).exec();
          const dataObj = {
            ...data._doc,
            roleName: roleObj.name,
            companyName: companyObj.name,
            fashionType: typeFashionObj.name,
          };
          return dataObj;
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

exports.create = async (req, res) => {
  // Validate request
  const result = createSchema.validate(req.body);

  if (result.error) {
    const { message } = result.error;
    res.status(422).send({ message });
    return;
  }

  // Create a Employee
  const { roleId, companyId } = req.body;

  try {
    const hasRole = await Role.findOne({ _id: roleId }).exec();
    if (!hasRole) {
      res.status(422).send({ message: `"${roleId}" role have not in the system ` });
      return;
    }
  } catch (error) {
    res.status(422).send({ message: `"${roleId}" role have not in the system ` });
    return;
  }

  try {
    const hasCompany = await Company.findOne({ _id: companyId }).exec();
    if (!hasCompany) {
      res.status(422).send({ message: `"${companyId}" have not in the system` });
      return;
    }
  } catch (error) {
    res.status(422).send({ message: `"${companyId}" have not in the system` });
    return;
  }

  const employee = new Employee({
    ...req.body,
  });

  // Save Contract in the database
  Employee.create(employee)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

exports.update = async (req, res) => {
  const employeeId = req.params.id;

  const result = updateSchema.validate({ ...req.body, employeeId });

  if (result.error) {
    const { message } = result.error;
    res.status(422).send({ message });
    return;
  }

  // Create a Employee
  const { roleId, companyId } = req.body;
  if (roleId) {
    try {
      const hasRole = await Role.findOne({ _id: roleId }).exec();
      if (!hasRole) {
        res.status(422).send({ message: `"${roleId}" role have not in the system ` });
        return;
      }
    } catch (error) {
      res.status(422).send({ message: `"${roleId}" role have not in the system ` });
      return;
    }
  }

  if (companyId) {
    try {
      const hasCompany = await Company.findOne({ _id: companyId }).exec();
      if (!hasCompany) {
        res.status(422).send({ message: `"${companyId}" have not in the system` });
        return;
      }
    } catch (error) {
      res.status(422).send({ message: `"${companyId}" have not in the system` });
      return;
    }
  }

  // Save Contract in the database
  Employee.findOneAndUpdate({ _id: employeeId }, { ...req.body })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};
