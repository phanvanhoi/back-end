const db = require("../models");
const ExcelJS = require("exceljs");
const Contract = db.contract;

// Find all published Contracts
exports.findAll = (req, res) => {
  Contract.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res?.status(500).send({
        message: err.message || "Some error occurred while retrieving Contracts.",
      });
    });
};

// Create and Save a new Contract
exports.create = (req, res) => {
  const { name = "", companyId = undefined } = req.body;
  // Validate request
  if (!name) {
    res.status(422).send({ message: "Name can not be empty!" });
    return;
  }

  if (!companyId) {
    res.status(422).send({ message: "companyId can not be empty!" });
    return;
  }

  // Create a Contract
  const contract = new Contract({
    name: name,
    companyId: companyId,
  });

  // Save Contract in the database
  Contract.create(contract)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};


exports.downloadExcell = (req, res) => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet 1");

  // Add data to the worksheet
  worksheet.getCell("A1").value = "Hello";
  worksheet.getCell("B1").value = "World!";

  // Set response headers
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", 'attachment; filename="example.xlsx"');

  // Send the workbook as a response
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};
