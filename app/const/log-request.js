const { DateTime: dt } = require("luxon");
exports.logRequest = (router) => {
  router.use((req, res, next) => {
    console.log("Time: ", dt.now().toFormat("HH'h 'mm'm' dd'/'MM'/'yyyy"));
    console.log("originalUrl: ", req.originalUrl);
    next();
  });
};
