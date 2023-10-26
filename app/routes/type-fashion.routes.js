module.exports = (app) => {
  const typeFashions = require("../controllers/type-fashion.controller.js");

  const router = require("express").Router();
  router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    console.log("originalUrl: ", req.originalUrl);
    next();
  });
  // Create a new Tutorial
  router.get("/", typeFashions.getAll);
  router.post("/create", typeFashions.create);

  app.use("/api/type-fashions", router);
};
