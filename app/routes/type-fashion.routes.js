const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const typeFashions = require("../controllers/type-fashion.controller.js");
  const router = require("express").Router();
  logRequest(router);
  // Create a new Tutorial
  router.get("/", typeFashions.getAll);
  router.get("/find-one", typeFashions.findOneTypeFashion);
  router.get("/options", typeFashions.getOptions);
  router.post("/", typeFashions.create);
  router.post("/delete", typeFashions.deleteFashioneType);
  router.put("/:id", typeFashions.updateById);

  app.use("/api/type-fashions", router);
};
