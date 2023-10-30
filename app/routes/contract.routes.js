module.exports = (app, router) => {
  const contracts = require("../controllers/contract.controller.js");

  // Create a new Tutorial
  router.post("/create", contracts.create);

  // Download excell file
  router.get("/download-excel", contracts.downloadExcell);

  // Get all contract
  router.get("/get-all-contracts", contracts.findAllContract);

  app.use("/api/contract", router);
};
