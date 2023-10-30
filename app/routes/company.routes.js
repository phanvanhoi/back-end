module.exports = (app,router) => {
  const companys = require("../controllers/company.controller.js");

  // Create a new Tutorial
  router.get("/", companys.getAll);
  router.post("/create", companys.create);

  app.use("/api/companys", router);
};
