const { logRequest } = require("../const/log-request.js");
module.exports = (app) => {
  const roles = require("../controllers/role.controller.js");
  const router = require("express").Router();
  logRequest(router);

  router.get("/", roles.getAll);
  router.post("/", roles.create);
  router.post("/update-by-names", roles.updateByNames);

  app.use("/api/roles", router);
};
