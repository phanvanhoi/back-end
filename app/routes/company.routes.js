const { logRequest } = require("../const/log-request.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
module.exports = (app) => {
  const companys = require("../controllers/company.controller.js");
  const router = require("express").Router();

  logRequest(router);

  // Create a new Tutorial
  router.get("/", companys.getAll);
  router.get("/:id", companys.getOne);
  router.get("/download/:id", companys.downloadExcell);
  router.post("/upload/:id", companys.uploadExcel);
  router.post("/", companys.create);
  router.put("/:id", companys.updateById);
  router.get("/set-type-fashions/option/:id", companys.getOptionsFromEmployeeByCompanyAndContract);

  app.use("/api/companys", router);
};
