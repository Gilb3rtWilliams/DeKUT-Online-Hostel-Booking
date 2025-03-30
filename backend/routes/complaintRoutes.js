const express = require("express");
const { protect, studentOnly, adminOnly } = require("../middleware/authMiddleware");
const {
  createComplaint,
  getAllComplaints,
  getStudentComplaints,
  addReply,
  updateComplaintStatus
} = require("../controllers/complaintController");

const router = express.Router();

/**
 * @swagger
 * /api/complaints:
 *   post:
 *     summary: Submit a complaint
 *     description: Students can submit a complaint about hostels or services.
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Complaint submitted successfully.
 *       400:
 *         description: Invalid input.
 *       500:
 *         description: Server error.
 */
router.post("/", protect, studentOnly, createComplaint);

router.get("/", protect, adminOnly, getAllComplaints);

router.get("/student", protect, studentOnly, getStudentComplaints);

router.post("/:id/reply", protect, adminOnly, addReply);

router.put("/:id/status", protect, adminOnly, updateComplaintStatus);

module.exports = router;
