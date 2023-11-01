const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const sign = require("../controllers/employees-contracts-sign.controller.js");
  const router = require("express").Router();
  logRequest(router);

  // Create a new Tutorial
  router.get("/");
  router.post("/", sign.create);
  router.put("/:id");
  router.post("/create-sign-by-type-fashion", sign.createByTypeFashion);

  app.use("/api/signs", router);
};
