const express = require("express");
const notificationController = require("../controller/NotificationController");

const router = express.Router();

router.post("/", notificationController.createNotification);
router.get("/", notificationController.getLatestNotifications);

module.exports = router;
