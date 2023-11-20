/** @format */
const db = require("../models");
const { employee: Employee, role: Role, company: Company, typeFashion: TypeFashion, contract: Contract } = db;
const { employeeSchema } = require("../schema/index");
const { createSchema, updateSchema } = employeeSchema;

exports.get = (req, res) => {
  const companyId = req.params.id;
  const conditions = companyId ? { companyId } : {};
  Employee.find(conditions)
    .then(async (data) => {
      const dataArr = data || [];
      const dataConvert = await Promise.all(
        dataArr.map(async (data) => {
          const { companyId } = data;

          const companyObj = await Company.findOne({ _id: companyId }).exec();
          const dataObj = {
            ...data._doc,
            companyName: companyObj.name,
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

exports.handdleManyEmployee = async (employees) => {
  let result;
  const employeeObjs = [];
  await Promise.all(
    employees.map(async (employee) => {
      result = createSchema.validate(employee);
      if (result.error) {
        return result.error;
      }
      const { companyId = "" } = employee;
      try {
        const hasCompany = await Company.findOne({ _id: companyId }).exec();
        if (!hasCompany) {
          return `"${companyId}" company have not in the system`;
        }
      } catch (error) {
        return `The system have some errors`;
      }
      employeeObjs.push(new Employee(employee));
    })
  );

  return Employee.insertMany(employeeObjs);
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
  const { roleId, companyId, contractId } = req.body;

  try {
    const hasCompany = await Company.findOne({ _id: companyId }).exec();
    if (!hasCompany) {
      res.status(422).send({ message: `"${companyId}" company have not in the system` });
      return;
    }

    const hasRole = await Role.findOne({ _id: roleId }).exec();
    if (!hasRole) {
      res.status(422).send({ message: `"${roleId}" role have not in the system ` });
      return;
    }

    const hasContract = await Contract.findOne({ _id: contractId }).exec();
    if (!hasContract) {
      res.status(422).send({ message: `"${contractId}" contract have not in the system ` });
      return;
    }
  } catch (error) {
    res.status(500).send({ message: `The system have some errors` });
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
