const NotificationRouter = require("../router/NotificationRouter");
const InventoryRouter = require("../router/InventoryRouter");
const routes = (app) => {
  app.use("/notification", NotificationRouter);
  app.use("/invent", NotificationRouter);
};
module.exports = routes;
