const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const typeFashions = require("../controllers/type-fashion.controller.js");
  const router = require("express").Router();
  logRequest(router);
  // Create a new Tutorial
  router.get("/get-all", typeFashions.getAll);
  router.post("/create", typeFashions.create);

  app.use("/api/type-fashions", router);
};
