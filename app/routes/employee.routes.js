module.exports = (app, router) => {
  const employees = require("../controllers/employee.controller.js");

  // Create a new Tutorial
  router.get("/", employees.getAll);
  router.post("/create", employees.create);
  router.put("/update/:id", employees.update);

  app.use("/api/employees", router);
};
