const express = require("express");

const router = express.Router();

const {

  createCourse,
  getCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse

} = require("../controllers/courseController");

const { authMiddleware } = require(
  "../middleware/authMiddleware"
);

const roleMiddleware = require(
  "../middleware/roleMiddleware"
);



// CREATE COURSE
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createCourse
);



// GET ALL COURSES
router.get(
  "/",
  getCourses
);



// GET SINGLE COURSE
router.get(
  "/:id",
  getSingleCourse
);



// UPDATE COURSE
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateCourse
);



// DELETE COURSE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteCourse
);

module.exports = router;