const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const companys = require("../controllers/company.controller.js");
  const router = require("express").Router();

  logRequest(router);

  // Create a new Tutorial
  router.get("/", companys.getAll);
  router.post("/create", companys.create);

  app.use("/api/companys", router);
};
