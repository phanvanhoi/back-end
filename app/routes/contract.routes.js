module.exports = (app) => {
  const contracts = require("../controllers/contract.controller.js");

  const router = require("express").Router();
  router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    console.log("originalUrl: ", req.originalUrl);
    next();
  });
  // Create a new Tutorial
  router.post("/create", contracts.create);

  // Download excell file
  router.get("/download-excel", contracts.downloadExcell);

  // Get all contract
  router.get("/get-all-contracts", contracts.findAllContract);

  app.use("/api/contract", router);
};
