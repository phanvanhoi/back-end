module.exports = (app, router) => {
  const typeFashions = require("../controllers/type-fashion.controller.js");

  // Create a new Tutorial
  router.get("/", typeFashions.getAll);
  router.post("/create", typeFashions.create);

  app.use("/api/type-fashions", router);
};
