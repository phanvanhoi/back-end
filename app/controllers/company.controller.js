const url = require("url");
const ExcelJS = require("exceljs");
const db = require("../models");
const { company: Company, image: Image, employee: Employee } = db;
const { companySchema } = require("../schema/index");
const { createSchema, updateSchema } = companySchema;
const { columnCharacters, getColumns } = require("../const/excel-column");
const { typeFashion: TypeFashion, item: Item, role: Role, setTypeFashion: SetTypeFashion, contract: Contract } = db;
const moment = require("moment");
const dayjs = require("dayjs");

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

const getSetOfFashionByContract = async (setTypeFashionName) => {
  const setOfFashion = await SetTypeFashion.findOne({ name: setTypeFashionName });
  return setOfFashion || {};
};

const createHeaderExcell = async (setTypeFashionName) => {
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
      value: "Điện thoại",
    },
    {
      column: "E2:E3",
      value: "Năm sinh",
    },
    {
      column: "F2:F3",
      value: "Giới tính",
    },
    {
      column: "G2:G3",
      value: "Đơn vị công tác",
    },
    {
      column: "H2:H3",
      value: "Loại ĐP",
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

  const typeOfFashion = await getSetOfFashionByContract(setTypeFashionName);
  const typeOfFashionItems = typeOfFashion.items;

  if (!typeOfFashion.items) {
    return null;
  }

  let rootColumn = 9;
  let lengthSetFashion = 0;
  for (let properties in typeOfFashionItems) {
    const items = Object.keys(typeOfFashionItems[properties].items || {});
    const length = items.length;
    lengthSetFashion += length;
    const getColumnRange = getColumns(rootColumn, rootColumn + length, 2);
    const getColumn = getColumns(rootColumn, rootColumn + length, 3);
    rootColumn = rootColumn + length;

    worksheet.mergeCells(`${getColumnRange[0]}:${getColumnRange[getColumnRange.length - 1]}`);
    getCell = worksheet.getCell(getColumnRange[0]);
    getCell.border = border;
    getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
    getCell.value = properties;
    getCell.height = 100;

    getColumn.map((col, index) => {
      getCell = worksheet.getCell(col);
      getCell.border = border;
      getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true, textRotation: 90 };
      getCell.value = items[index];
    });
  }

  const title = {
    column: getColumns(1, rootColumn + 2, 1),
    value: typeOfFashion.name,
  };

  const rangeHeader = `${title.column[0]}:${title.column[title.column.length - 1]}`;

  worksheet.mergeCells(rangeHeader);
  getCell = worksheet.getCell(title.column[0]);
  getCell.border = border;
  getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
  getCell.value = title.value;
  getCell.font = {
    name: "Times New Roman",
    family: 2,
    size: 20,
    italic: true,
    bold: true,
  };

  return workbook;
};

exports.downloadExcell = async (req, res) => {
  // Create a new workbook and worksheet
  const urlParts = url.parse(req.url, true);
  const { setTypeFashionName = "" } = urlParts.query;

  const workbook = await createHeaderExcell(setTypeFashionName);
  if (workbook === null) {
    res.status(422).send({ message: `Bạn chưa thiết lập chức danh` });
  } else {
    // Set response headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", 'attachment; filename="example.xlsx"');

    // Send the workbook as a response
    workbook.xlsx.write(res).then(() => {
      res.end();
    });
  }
};

const checkRoleAndGetitems = (typeFashtion, roleName) => {
  for (let properties in typeFashtion) {
    if (typeFashtion[properties].roles.includes(roleName))
      return {
        properties,
        value: typeFashtion[properties],
      };
  }
};
exports.uploadExcel = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  const urlParts = url.parse(req.url, true);
  const { nameContract = "" } = urlParts.query;

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

  const typeOfFashion = (await getSetOfFashionByContract(nameContract)).items;

  await workbook.xlsx
    .load(excelFile.data)
    .then(async () => {
      const worksheet = workbook.getWorksheet(1);
      const objectData = [];

      if (worksheet.actualRowCount < 4) {
        res.status(402).send({ message: "Chưa có nhân viên nào được thêm vào" });
      }

      const urlParts = url.parse(req.url, true);
      const { nameContract = "" } = urlParts.query;

      await new Promise((resolve, reject) => {
        worksheet.eachRow(async (row, rowNumber) => {
          let dataEachRow = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
          if (rowNumber >= 4) {
            try {
              row.eachCell((cell, colNumber) => {
                dataEachRow[colNumber] = cell.value;
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
                      dataObj = { ...dataObj, name: value && (value + "").trim() };
                      break;
                    case 4:
                      dataObj = { ...dataObj, numberPhone: value && (value + "").trim() };
                      break;
                    case 5:
                      const birthday = moment(value, "DD/MM/YYYY").toDate();
                      if (birthday === "Invalid date") {
                        res.status(402).send(`${value} invalid`);
                        return;
                      }
                      dataObj = { ...dataObj, birthday };
                      break;
                    case 6:
                      dataObj = { ...dataObj, sex: value && value.toLocaleLowerCase().trim() };
                      break;
                    case 7:
                      const roleName = value && (value + "").trim();
                      const items = checkRoleAndGetitems(typeOfFashion, roleName);
                      dataObj = {
                        ...dataObj,
                        roleName,
                        typeFashion: items?.properties,
                        items: {
                          [nameContract]: { contract: items?.value ? items?.value.items : {}, createAt: dayjs().unix() },
                        },
                      };
                      break;
                    case 8:
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
            } catch (error) {
              console.log("error", error);
            }
          }
        });
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

exports.getOptionsFromEmployeeByCompanyAndContract = async (req, res) => {
  const companyId = req.params.id;

  try {
    const hasCompany = await Company.findOne({ _id: companyId }).exec();
    if (!hasCompany) {
      res.status(422).send({ message: `"${companyId}" company have not in the system` });
      return;
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

    const distinctOptions = [...new Set(options)];
    const result = distinctOptions.map((e) => {
      return {
        lable: e,
        value: e,
      };
    });
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({
      message: error.message || "Some error occurred while creating the Contract.",
    });
  }
};
