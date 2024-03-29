const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const employees = require("../controllers/employee.controller.js");
  const router = require("express").Router();
  logRequest(router);

  // Create a new Tutorial
  router.get("/", employees.get);
  router.get("/company/:id", employees.get);
  router.post("/", employees.create);
  router.post("/create-or-update-actual-contract/:id", employees.createOrUpdateActualContract);
  router.put("/:id", employees.update);

  app.use("/api/employees", router);
};
