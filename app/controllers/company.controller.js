const ExcelJS = require("exceljs");
const db = require("../models");
const { company: Company, image: Image } = db;
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

exports.updateById = (req, res) => {
  const companyId = req.params.id;

  // Validate request
  const result = updateSchema.validate({ ...req.body, id: companyId });
  if (result.error) {
    const { message } = result.error;
    res.status(422).send({ message });
    return;
  }

  // Save Contract in the database
  Company.findOneAndUpdate({ _id: companyId }, req.body)
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
  const companyId = req.params.id;
  Company.findOne({ _id: companyId })
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
  Company.find()
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
  Company.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the Contract.",
      });
    });
};

const createHeaderExcell = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("DS CHUẨN HĐ 1");
  const border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };

  const header = [
    {
      column: "A1:BC1",
      value: "DANH SÁCH CBCNV MAY ĐỒNG PHỤC - 2023",
    },
    {
      column: "A2:A3",
      value: "STT",
    },
    {
      column: "B2:B3",
      value: "TT",
    },
    {
      column: "C2:C3",
      value: "Họ và tên",
    },
    {
      column: "D2:D3",
      value: "Khối",
    },
    {
      column: "E2:E3",
      value: "Chức danh",
    },
    {
      column: "F2:F3",
      value: "Ngày tháng năm sinh",
    },
    {
      column: "G2:G3",
      value: "Loại đp",
    },
    {
      column: "H2:H3",
      value: "Giới tính",
    },
  ];

  //------------------Start header--------------------
  let rootCell, getCell;
  header.map((value, index) => {
    worksheet.mergeCells(value.column);
    rootCell = value.column.split(":");
    getCell = worksheet.getCell(rootCell[0]);
    getCell.border = border;
    getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    getCell.value = value.value;
    if (index === 0) {
      getCell.font = {
        name: "Times New Roman",
        family: 2,
        size: 20,
        italic: true,
        bold: true,
      };
    }
  });

  for (let index = 9; index <= 57; index++) {
    worksheet.getColumn(index).width = 3;
  }

  worksheet.getRow(1).height = 40;
  worksheet.getRow(1).border = border;
  worksheet.getRow(2).height = 60;
  worksheet.getRow(2).border = border;
  worksheet.getRow(3).height = 80;
  worksheet.getRow(3).border = border;
  worksheet.getRows(4, 500).forEach((row) => {
    row.height = 25;
    row.border = border;
  });
  //------------------End header--------------------

  const typeOfFashion = await TypeFashion.find()
    .then(async (data) => {
      const dataConvert = await Promise.all(
        await data.map(async (value) => {
          const doc = value._doc;
          const itemIds = doc.items.split(",");
          let items = await Item.find({ _id: { $in: itemIds } }).exec();
          items = items.map((e) => e._doc);
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

  let rootColumn = 9;
  typeOfFashion.map((value) => {
    const items = value.items;
    const length = items.length;
    const getColumnRange = getColumns(rootColumn, rootColumn + length, 2);
    const getColumn = getColumns(rootColumn, rootColumn + length, 3);
    rootColumn = rootColumn + length;

    worksheet.mergeCells(`${getColumnRange[0]}:${getColumnRange[getColumnRange.length - 1]}`);
    getCell = worksheet.getCell(getColumnRange[0]);
    getCell.border = border;
    getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    getCell.value = value.name;
    getCell.height = 100;

    getColumn.map((col, index) => {
      getCell = worksheet.getCell(col);
      getCell.border = border;
      getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true, textRotation: 90 };
      getCell.value = items[index].name;
    });
  });
  return workbook;
};

exports.downloadExcell = async (req, res) => {
  // Create a new workbook and worksheet

  const workbook = await createHeaderExcell();
  // Set response headers
  res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
  res.setHeader("Content-Disposition", 'attachment; filename="example.xlsx"');

  // Send the workbook as a response
  workbook.xlsx.write(res).then(() => {
    res.end();
  });
};

exports.uploadExcel = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const excelFile = req.files.file;
  const workbook = new ExcelJS.Workbook();
  const companyId = req.params.id;

  try {
    const hasCompany = await Company.findOne({ _id: companyId }).exec();
    if (!hasCompany) {
      res.status(422).send({ message: `"${companyId}" company have not in the system ` });
      return;
    }
  } catch (error) {
    res.status(422).send({ message: `"${companyId}" company have not in the system ` });
    return;
  }

  await workbook.xlsx
    .load(excelFile.data)
    .then(async () => {
      const worksheet = workbook.getWorksheet(1);
      const objectData = [];
      await new Promise((resolve, reject) => {
        worksheet.eachRow(async (row, rowNumber) => {
          let dataEachRow = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

          if (rowNumber >= 4) {
            row.eachCell((cell, colNumber) => {
              dataEachRow[colNumber] = cell.value;
              console.log(`Cell ${colNumber} in Row ${rowNumber} has value: ${cell.value}`);
            });

            let dataObj = { companyId };
            await Promise.all(
              dataEachRow.map(async (value, index) => {
                switch (index) {
                  case 1:
                    break;
                  case 2:
                    break;
                  case 3:
                    dataObj = { ...dataObj, name: value && value.trim() };
                    break;
                  case 4:
                    break;
                  case 5:
                    const name = value && value.trim();
                    const id = await Role.findOne({ name });
                    if (!id) {
                      res.status(402).send(`Role ${name} is not has in the system`);
                      return;
                    } else {
                      const roleId = id._doc._id + "";
                      dataObj = { ...dataObj, roleId };
                    }

                    break;
                  case 6:
                    const birthday = moment(value, "DD/MM/YYYY").toDate();
                    if (birthday === "Invalid date") {
                      res.status(402).send(`${value} invalid`);
                      return;
                    }
                    dataObj = { ...dataObj, birthday };
                    break;
                  case 7:
                    break;
                  case 8:
                    dataObj = { ...dataObj, sex: value && value.toLocaleLowerCase().trim() };
                    break;
                  case 9:
                    break;

                  default:
                    break;
                }
              })
            );

            objectData.push(dataObj);
            if (objectData.length + 3 === worksheet.actualRowCount) {
              resolve(objectData);
            }
          }
        });
      });

      objectData.forEach((value) => {
        console.log("objectData", JSON.stringify(value));
      });

      handdleManyEmployee(objectData).then((value) => {
        res.status(200).send("Excel file uploaded and processed successfully.");
      });
    })
    .catch((error) => {
      console.error("Error reading Excel file:", error);
      res.status(500).send("Error reading Excel file.");
    });
};
