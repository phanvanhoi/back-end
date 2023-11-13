const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const items = require("../controllers/item.controller.js");
  const router = require("express").Router();
  logRequest(router);
  router.get("/", items.getAll);
  router.post("/", items.create);
  router.delete("/:id", items.deleteItem);

  app.use("/api/items", router);
};
