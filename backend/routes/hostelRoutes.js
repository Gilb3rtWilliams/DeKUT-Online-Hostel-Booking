const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { 
  addHostel, 
  updateHostel, 
  deleteHostel, 
  getHostels, 
  getHostelById 
} = require("../controllers/hostelController");

const router = express.Router();

// Admin-only routes
/**
 * @swagger
 * /api/hostels:
 *   post:
 *     summary: Add a new hostel
 *     description: Admins can add a new hostel to the system.
 *     tags: [Hostels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               totalRooms:
 *                 type: integer
 *               availableRooms:
 *                 type: integer
 *               pricePerRoom:
 *                 type: number
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Hostel added successfully.
 *       400:
 *         description: Invalid input or hostel already exists.
 *       500:
 *         description: Server error.
 */
router.post("/", protect, adminOnly, addHostel);

router.put("/:id", protect, adminOnly, updateHostel);
router.delete("/:id", protect, adminOnly, deleteHostel);

// Public routes
/**
 * @swagger
 * /api/hostels:
 *   get:
 *     summary: Get all hostels
 *     description: Retrieve a list of all available hostels.
 *     tags: [Hostels]
 *     responses:
 *       200:
 *         description: Successfully retrieved hostels.
 *       500:
 *         description: Server error.
 */
router.get("/", getHostels);

/**
 * @swagger
 * /api/hostels/{id}:
 *   get:
 *     summary: Get a hostel by ID
 *     description: Retrieve details of a specific hostel by ID.
 *     tags: [Hostels]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hostel ID
 *     responses:
 *       200:
 *         description: Successfully retrieved hostel.
 *       404:
 *         description: Hostel not found.
 *       500:
 *         description: Server error.
 */
router.get("/:id", getHostelById);

console.log({ getHostels, getHostelById, addHostel, updateHostel, deleteHostel });

module.exports = router;
