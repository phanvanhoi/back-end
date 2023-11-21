const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const setTypeFashions = require("../controllers/set-type-fashion.controller.js");
  const router = require("express").Router();
  logRequest(router);
  // Create a new Tutorial
  router.get("/:id", setTypeFashions.getOne);
  router.put("/:id", setTypeFashions.updateById);
  router.get("/", setTypeFashions.getAll);
  router.post("/", setTypeFashions.create);
  router.post("/delete", setTypeFashions.deleteSetFashioneType);
  router.get("/options/1", setTypeFashions.getOptions);

  app.use("/api/set-type-fashions", router);
};
