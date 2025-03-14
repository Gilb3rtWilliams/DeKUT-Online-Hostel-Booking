const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getNotifications, markNotificationAsRead } = require("../controllers/notificationController");

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get user notifications
 *     description: Retrieve all notifications for the logged-in user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully.
 *       500:
 *         description: Server error.
 */
router.get("/", protect, getNotifications);

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     summary: Mark a notification as read
 *     description: Mark a specific notification as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Server error.
 */
router.put("/:id", protect, markNotificationAsRead);


module.exports = router;
