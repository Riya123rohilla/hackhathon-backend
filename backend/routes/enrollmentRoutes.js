const express = require("express");
const router = express.Router();
const {
    enrollCourse,
    getMyEnrollments,
    unenrollCourse
} = require("../controllers/enrollmentController");

const { authMiddleware } = require("../middleware/authMiddleware");

// GET MY ENROLLED COURSES
router.get("/my-courses",authMiddleware,getMyEnrollments);

// ENROLL IN COURSE
router.post("/:id",authMiddleware,enrollCourse);

// UNENROLL FROM COURSE
router.delete("/:id",authMiddleware,unenrollCourse);


module.exports = router;