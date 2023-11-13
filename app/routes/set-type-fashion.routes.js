const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const setTypeFashions = require("../controllers/set-type-fashion.controller.js");
  const router = require("express").Router();
  logRequest(router);
  // Create a new Tutorial
  router.get("/:id", setTypeFashions.getOne);

  app.use("/api/set-type-fashions", router);
};
