const express = require("express");
const router = express.Router();

const { uploadAssignment, getMyAssignments } = require("../controllers/assignmentController");

const {
  validateAssignment
} = require("../middleware/validate");

const { authMiddleware } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

// UPLOAD ASSIGNMENT
router.post("/upload", authMiddleware, upload.single("file"), validateAssignment, uploadAssignment );


// GET ASSIGNMENTS
router.get("/my-assignments", authMiddleware, getMyAssignments);

module.exports = router;