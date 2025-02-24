const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
