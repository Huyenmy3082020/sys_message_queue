const Notification = require("../models/NotificationModel");

const saveNotification = async (data) => {
  try {
    const newNotification = await Notification.create(data);
    console.log("✅ Notification saved:", newNotification);
    return newNotification;
  } catch (error) {
    console.error("❌ Error saving notification:", error.message);
  }
};

const getLatestNotifications = async () => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("createdAt name stock message");

    return notifications;
  } catch (error) {
    throw new Error("Error fetching notifications: " + error.message);
  }
};

module.exports = { saveNotification, getLatestNotifications };
