module.exports = (app) => {
  const roles = require("../controllers/role.controller.js");

  const router = require("express").Router();
  router.use((req, res, next) => {
    console.log("Time: ", Date.now());
    console.log("originalUrl: ", req.originalUrl);
    next();
  });
  
  router.get("/", roles.getAll);
  router.post("/create", roles.create);

  app.use("/api/roles", router);
};
