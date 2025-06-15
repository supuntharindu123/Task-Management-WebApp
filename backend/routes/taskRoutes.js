import express from "express";
import { protect, authorize } from "../middlewares/auth.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  generateTaskPDF,
} from "../controllers/taskController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Put specific routes before parameter routes
router.get("/generate-pdf", generateTaskPDF);

router.route("/").get(getTasks).post(createTask);

router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);

export default router;
