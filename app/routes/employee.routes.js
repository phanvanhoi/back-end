const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const employees = require("../controllers/employee.controller.js");
  const router = require("express").Router();
  logRequest(router);

  // Create a new Tutorial
  router.get("/", employees.getAll);
  router.post("/create", employees.create);
  router.put("/update/:id", employees.update);

  app.use("/api/employees", router);
};
