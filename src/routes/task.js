import  express from "express";
import  jwt from 'jsonwebtoken';
import  Company from "../models/company.js"
import  {
  addTask,
  countTasks,
  userTasks,
  allTasks,
  taskById,
  updateTaskById,
  deleteTaskById,
} from "../controllers/task.js";
import  auth from "../middleware/auth.js";

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

router.get("/campanyTasks", auth, async (req, res) => {
  const token = req.token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  const company = await Company.findById(decodedToken.company).populate("tasks");
  res.send({ tasks: company.tasks });
})

export default router;
