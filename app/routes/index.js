const { logRequest } = require("../const/log-request.js");
const router = require("express").Router();

module.exports = (app) => {
  logRequest(router);
  require("./company.routes")(app, router);
  require("./contract.routes")(app, router);
  require("./employee.routes")(app, router);
  require("./role.routes")(app, router);
  require("./type-fashion.routes")(app, router);
};
