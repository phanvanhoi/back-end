const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.contract = require("./contract.model.js")(mongoose);
db.company = require("./company.model.js")(mongoose);
db.employee = require("./employee.model.js")(mongoose);

module.exports = db;