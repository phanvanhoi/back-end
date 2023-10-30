const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const contracts = require("../controllers/contract.controller.js");
  const router = require("express").Router();
  logRequest(router);

  // Create a new Tutorial
  router.post("/create", contracts.create);

  // Download excell file
  router.get("/download-excel", contracts.downloadExcell);

  // Get all contract
  router.get("/get-all-contracts", contracts.findAllContract);

  app.use("/api/contracts", router);
};
