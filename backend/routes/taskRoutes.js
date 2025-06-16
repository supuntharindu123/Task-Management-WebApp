import express from "express";
import { protect } from "../middlewares/auth.js";
import upload from "../config/multerConfig.js";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  generateTaskPDF,
  deleteTaskFile
} from "../controllers/taskController.js";

const router = express.Router();

// Protect all routes
router.use(protect);

// Put specific routes before parameter routes
router.get("/generate-pdf", generateTaskPDF);

router.route("/")
  .get(getTasks)
  .post(upload.array('files', 5), createTask); // Modified to handle file uploads

router.route("/:id")
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

// Add route for file deletion
router.delete("/:taskId/files/:fileId", deleteTaskFile);

export default router;
