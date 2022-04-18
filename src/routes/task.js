const express = require("express");
const {
  addTask,
  countTasks,
  userTasks,
  allTasks,
  taskById,
  updateTaskById,
  deleteTaskById,
} = require("../controllers/task");
const auth = require("../middleware/auth");
const router = express.Router();

// ADD NEW TASK
router.post("/tasks", auth, addTask);

// COUNT ALL TASKS
router.get("/tasks/count", countTasks);

// CURRENT USER TASKS
router.get("/tasks/me", auth, userTasks);

// GET ALL TASKS
router.get("/tasks", auth, allTasks);

// GET SINGLE TASK
router.get("/tasks/:id", auth, taskById);

// UPDATE TASK
router.patch("/tasks/:id", auth, updateTaskById);

// DELETE TASK
router.delete("/tasks/:id", auth, deleteTaskById);

module.exports = router;
