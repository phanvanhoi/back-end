const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const items = require("../controllers/item.controller.js");
  const router = require("express").Router();
  logRequest(router);
  router.get("/get-all", items.getAll);
  router.post("/create", items.create);

  app.use("/api/items", router);
};
