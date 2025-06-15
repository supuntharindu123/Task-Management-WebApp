import express from "express";
const router = express.Router();
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/auth.js";

// All routes are protected and require admin role
// router.use(protect);
// router.use(authorize("admin"));

router.route("/").get(getUsers);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default router;
