const express = require("express");
const router = express.Router();

const { getAllUsers, deleteUser } = require("../controllers/adminController");

const { authMiddleware } = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


// GET ALL USERS
router.get( "/users", authMiddleware, roleMiddleware("admin"), getAllUsers);

// DELETE USER
router.delete( "/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

module.exports = router;