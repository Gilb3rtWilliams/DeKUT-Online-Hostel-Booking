const express = require("express");
const { protect, studentOnly, adminOnly } = require("../middleware/authMiddleware");
const { submitFeedback, getAllFeedback } = require("../controllers/feedbackController");

const router = express.Router();

/**
 * @swagger
 * /api/feedback:
 *   post:
 *     summary: Submit feedback
 *     description: Students can submit feedback about hostel services.
 *     tags: [Feedback]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Feedback submitted successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post("/", protect, studentOnly, submitFeedback);
router.get("/", protect, adminOnly, getAllFeedback);

module.exports = router;
