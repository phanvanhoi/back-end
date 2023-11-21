/** @format */
const dayjs = require("dayjs");
const db = require("../models");
const { employee: Employee, role: Role, company: Company, typeFashion: TypeFashion, contract: Contract } = db;
const { employeeSchema } = require("../schema/index");
const { createSchema, updateSchema } = employeeSchema;
const url = require("url");

const getversionName = async (companyId) => {
  let result = [];
  const hasCompany = await Company.findOne({ _id: companyId }).exec();
  if (!hasCompany) {
    res.status(422).send({ message: `"${companyId}" company have not in the system` });
    return result;
  }

  const employees = await Employee.find({ companyId: companyId });

  const options = employees
    .map((e) => {
      const items = e._doc.items;
      const setTypeFashion = [];
      if (typeof items === "object") {
        for (let item in items) {
          setTypeFashion.push(item);
        }
      }
      return setTypeFashion;
    })
    .flat();

  result = [...new Set(options)];
  return result;
};
exports.get = async (req, res) => {
  const companyId = req.params.id;
  const urlParts = url.parse(req.url, true);
  const { year = "", versionName = "" } = urlParts.query;
  let conditions = companyId ? [{ companyId }] : [];
  let listVersionName = [];
  if (!versionName) {
    if (year) {
      listVersionName = await getversionName(companyId);
      if (listVersionName.length > 0) {
        const start = dayjs(`1-1-${year} 12:00:00 AM`).unix();
        const end = dayjs(`12-30-${year} 12:59:59 PM`).unix();

        const orCheck = [];
        listVersionName.forEach((e) => {
          orCheck.push({
            ["items." + e + ".createAt"]: { $gte: start, $lte: end },
          });
        });
        conditions = [
          ...conditions,
          {
            $or: orCheck,
          },
        ];
      }
    }
  } else {
    if (year) {
      const start = dayjs(`1-1-${year} 12:00:00 AM`).unix();
      const end = dayjs(`12-30-${year} 12:59:59 PM`).unix();

      conditions = [
        ...conditions,
        {
          ["items." + versionName + ".createAt"]: { $gte: start, $lte: end },
        },
      ];
    } else {
      conditions = [
        ...conditions,
        {
          ["items." + versionName]: { $exists: true },
        },
      ];
    }
  }

  Employee.find({ $and: conditions })
    .then(async (data) => {
      const dataArr = data || [];
      const dataConvert = await Promise.all(
        dataArr.map(async (data) => {
          const { companyId } = data;
          const items = data._doc.items;
          // const versionList = [];
          // if (typeof items === "object") {
          //   if (versionName) {
          //     versionList.push(items[versionName].contract);
          //   } else {
          //     for (let properties in items) {
          //       versionList.push(items[properties].contract);
          //     }
          //   }
          // }

          // const companyObj = await Company.findOne({ _id: companyId }).exec();
          const dataObj = {
            ...data._doc,
            items: items[versionName].contract,
            typeFashion: data._doc.typeFashion,
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
  await Promise.all(
    employees.map(async (employee) => {
      const { companyId = "" } = employee;
      try {
        const hasCompany = await Company.findOne({ _id: companyId }).exec();
        if (!hasCompany) {
          return `"${companyId}" company have not in the system`;
        }
      } catch (error) {
        return `The system have some errors`;
      }

      await Employee.findOneAndUpdate({ name: employee.name }, employee, { upsert: true, new: true, strict: false });
    })
  );

  return "ok";
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
