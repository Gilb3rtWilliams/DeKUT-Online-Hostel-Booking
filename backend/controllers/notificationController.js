const Notification = require("../models/Notification");

// @desc Get notifications for a user
// @route GET /api/notifications
// @access Private
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc Mark a notification as read
// @route PUT /api/notifications/:id
// @access Private
const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Function to create a new notification
const createNotification = async (userId, message) => {
  try {
    await Notification.create({ user: userId, message });
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = { getNotifications, markNotificationAsRead, createNotification };
