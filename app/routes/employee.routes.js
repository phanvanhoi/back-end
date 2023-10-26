module.exports = (app) => {
  const employees = require("../controllers/employee.controller.js");

  const router = require("express").Router();
  router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    console.log("originalUrl: ", req.originalUrl);
    next();
  });
  // Create a new Tutorial
  router.get("/", employees.getAll);
  router.post("/create", employees.create);
  router.put("/update/:id", employees.update);

  app.use("/api/employees", router);
};
