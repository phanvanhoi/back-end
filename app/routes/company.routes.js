module.exports = (app) => {
  const companys = require("../controllers/company.controller.js");

  const router = require("express").Router();
  router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    console.log("originalUrl: ", req.originalUrl);
    next();
  });
  // Create a new Tutorial
  router.get("/", companys.getAll);
  router.post("/create", companys.create);

  app.use("/api/companys", router);
};
