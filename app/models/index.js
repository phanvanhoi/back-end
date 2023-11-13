const dbConfig = require("../config/db.config.js");
const { GridFSBucket } = require("mongodb");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.contract = require("./contract.model.js")(mongoose);
db.company = require("./company.model.js")(mongoose);
db.employee = require("./employee.model.js")(mongoose);
db.role = require("./role.model.js")(mongoose);
db.item = require("./item.model.js")(mongoose);
db.typeFashion = require("./type-fashion.model.js")(mongoose);
db.sign = require("./employees-contracts-sign.model.js")(mongoose);
db.actual = require("./employees-contracts-actual.model.js")(mongoose);
db.image = require("./image.model.js")(mongoose);
db.setTypeFashion = require("./set-type-fashion.model.js")(mongoose);

const bucket = new GridFSBucket(db.mongoose.connection, { bucketName: "images" });
db.bucket = bucket;

module.exports = db;
