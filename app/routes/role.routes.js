module.exports = (app, router) => {
  const roles = require("../controllers/role.controller.js");

  router.get("/", roles.getAll);
  router.post("/create", roles.create);
  router.post("/update-by-names", roles.updateByNames);

  app.use("/api/roles", router);
};
