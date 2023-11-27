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
const async = require("async");

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
  const urlParts = url.parse(req.url, true);
  const { type = "" } = urlParts.query;
  let condition = {};
  if (type) {
    condition = { type };
  }
  Company.find(condition)
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
    worksheet.getColumn(index).width = 6;
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
    const itemObj = typeOfFashionItems[properties].items;
    const type = typeOfFashionItems[properties].type;
    if (type && typeof type === "object") {
      for (let typeProperties in type) {
        const length = items.length;
        lengthSetFashion += length;
        const getColumnRange = getColumns(rootColumn, rootColumn + length, 2);
        const getColumn = getColumns(rootColumn, rootColumn + length, 3);
        const priceColumn = getColumns(rootColumn, rootColumn + length, 4);
        rootColumn = rootColumn + length;

        worksheet.mergeCells(`${getColumnRange[0]}:${getColumnRange[getColumnRange.length - 1]}`);
        getCell = worksheet.getCell(getColumnRange[0]);
        getCell.border = border;
        getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        getCell.value = type[typeProperties] + " " + properties;
        getCell.height = 100;

        getColumn.map((col, index) => {
          getCell = worksheet.getCell(col);
          getCell.border = border;
          getCell.alignment = { horizontal: "center", vertical: "middle", wrapText: true, textRotation: 90 };
          getCell.value = items[index];
        });

        priceColumn.map((col, index) => {
          getCell = worksheet.getCell(col);
          getCell.border = border;
          getCell.alignment = { horizontal: "center", vertical: "middle" };
          getCell.value = itemObj[items[index]].price;
        });
      }
    } else {
      const length = items.length;
      lengthSetFashion += length;
      const getColumnRange = getColumns(rootColumn, rootColumn + length, 2);
      const getColumn = getColumns(rootColumn, rootColumn + length, 3);
      const priceColumn = getColumns(rootColumn, rootColumn + length, 4);
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

      priceColumn.map((col, index) => {
        getCell = worksheet.getCell(col);
        getCell.border = border;
        getCell.alignment = { horizontal: "center", vertical: "middle" };
        getCell.value = itemObj[items[index]].price;
      });
    }
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

  if (!setTypeFashionName) {
    res.status(422).send({ message: `Chưa chọn loại đồng phục` });
  }

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

function capitalize(s) {
  return s && s[0].toUpperCase() + s.slice(1);
}

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

      if (worksheet.actualRowCount < 5) {
        res.status(402).send({ message: "Chưa có nhân viên nào được thêm vào" });
      }

      const urlParts = url.parse(req.url, true);
      const { nameContract = "" } = urlParts.query;

      let propertiesEmployee = [];
      const objectData = [];
      const eachRowPromise = [];
      worksheet.eachRow(async (row, rowNumber) => {
        eachRowPromise.push(
          new Promise(async (resolve) => {
            let result = {};
            let resetItemNumber = "none";
            let dataEachRow = new Array(propertiesEmployee.length);
            if (rowNumber >= 5) {
              try {
                row.eachCell((cell, colNumber) => {
                  dataEachRow[colNumber - 1] = cell.value;
                });

                dataEachRow.forEach((val, index) => {
                  if (val && index > 8) {
                    resetItemNumber = "willCheck";
                  }
                });

                if (propertiesEmployee.length > 0) {
                  let objectValue, roleName, items, info, contract, typeFashion, sexEmP, itemClone;

                  await Promise.all(
                    propertiesEmployee.map(async (value, index) => {
                      await new Promise(async (resolve) => {
                        if (index <= 6) {
                          objectValue = dataEachRow[index];
                          switch (index) {
                            case 2:
                              result = { ...result, name: objectValue && (objectValue + "").trim() };
                              break;
                            case 3:
                              result = { ...result, numberPhone: objectValue && (objectValue + "").trim() };
                              break;
                            case 4:
                              const birthday = moment(objectValue, "DD/MM/YYYY").toDate();
                              if (birthday === "Invalid date") {
                                res.status(402).send(`${objectValue} invalid`);
                                return;
                              }
                              result = { ...result, birthday };
                              break;
                            case 5:
                              result = { ...result, sex: objectValue && objectValue.toLocaleLowerCase().trim() };
                              break;
                            case 6:
                              roleName = objectValue && (objectValue + "").trim();
                              items = checkRoleAndGetitems(typeOfFashion, roleName);
                              info = items?.value;
                              contract = {};
                              typeFashion = items?.properties;
                              if (info) {
                                const types = info.type;
                                if (types) {
                                  sexEmP = result.sex || "nam";
                                  itemClone = JSON.parse(JSON.stringify(info.items));
                                  for (let properties in types) {
                                    if (types[properties] !== sexEmP) {
                                      delete itemClone[properties];
                                    }
                                  }
                                  contract = itemClone;
                                  typeFashion = capitalize(sexEmP) + " " + typeFashion;
                                } else {
                                  contract = info.items;
                                }
                                if (resetItemNumber === "willCheck") {
                                  for (let name in contract) {
                                    contract[name].number = 0;
                                  }
                                  resetItemNumber = "done";
                                }
                              }
                              result = {
                                ...result,
                                roleName,
                                typeFashion,
                                items: {
                                  [nameContract]: { contract, createAt: dayjs().unix() },
                                },
                              };
                              break;
                            default:
                              break;
                          }
                          resolve();
                        } else {
                          let itemObj = await Item.findOne({ name: value }).exec();
                          let itemExist = false;
                          for (let name in contract) {
                            if (value === name && dataEachRow[index]) {
                              itemExist = true;
                              result.items[nameContract].contract[name].number = dataEachRow[index];
                              break;
                            }
                          }

                          if (!itemExist) {
                            if (itemObj && dataEachRow[index]) {
                              itemObj = { ...itemObj._doc, number: dataEachRow[index] };
                              contract = { ...contract, [value]: itemObj };
                              result.items[nameContract].contract = contract;
                            } else {
                              result = { ...result, [value]: dataEachRow[index] };
                            }
                          }

                          resolve();
                        }
                      });
                    })
                  ).then(() => {
                    resolve(result);
                  });
                } else {
                  resolve(result);
                }
              } catch (error) {
                console.log("error", error);
                resolve(result);
              }
            } else {
              if (rowNumber === 3) {
                propertiesEmployee = row._cells.map((e) => e.value);
              }
              resolve(result);
            }
          })
        );
      });

      await Promise.all(eachRowPromise).then((result) => {
        result.forEach((val) => {
          const keys = Object.keys(val);
          if (keys.length > 0) {
            objectData.push({ ...val, companyId });
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
