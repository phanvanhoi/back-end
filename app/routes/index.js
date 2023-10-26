module.exports = (app) => {
  require("./company.routes")(app);
  require("./contract.routes")(app);
  require("./employee.routes")(app);
};
