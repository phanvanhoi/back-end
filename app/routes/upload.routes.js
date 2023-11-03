const { logRequest } = require("../const/log-request.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

module.exports = (app) => {
  const uploads = require("../controllers/upload.controller.js");
  const router = require("express").Router();

  logRequest(router);

  // Create a new Tutorial
  router.get("/:id", uploads.getResource);
  router.post("/", upload.single("image"), uploads.upload);
  app.use("/uploads", router);
};
