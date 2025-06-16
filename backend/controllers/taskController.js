import Task from "../models/Task.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import generatePDF from "../utils/generatePDF.js";
import fs from "fs/promises";
import path from "path";

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export async function getTasks(req, res, next) {
  try {
    let query;
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Basic filtering
    query = Task.find(JSON.parse(queryStr))
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email"); // Add createdBy population

    // If user is not admin, only show their tasks
    if (req.user.role !== "admin") {
      query = query.or([
        { assignedTo: req.user.id },
        { createdBy: req.user.id },
      ]);
    }

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Task.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const tasks = await query;

    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      pagination,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export async function getTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id).populate(
      "assignedTo",
      "name email"
    );

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is task owner or admin
    if (
      task.assignedTo._id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(`User not authorized to access this task`, 401)
      );
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    // Log the incoming request
    console.log("Request body:", req.body);
    console.log("Files:", req.files);

    // Parse the taskData from form data
    let taskData;
    try {
      taskData = JSON.parse(req.body.taskData);
    } catch (error) {
      console.error("Error parsing taskData:", error);
      return res.status(400).json({
        success: false,
        message: "Invalid task data format",
      });
    }

    // Add createdBy field
    taskData.createdBy = req.user._id;

    // Handle file attachments
    if (req.files && req.files.length > 0) {
      taskData.attachments = req.files.map((file) => ({
        filename: file.originalname,
        path: file.path.replace(/\\/g, "/"),
      }));
    }

    // Create the task
    const task = await Task.create(taskData);

    // Populate references
    await task.populate(["assignedTo", "createdBy"]);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Task creation error:", error);
    // Clean up any uploaded files
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlink(file.path, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      });
    }
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export async function updateTask(req, res, next) {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
    }

    // Parse task data from form data
    let taskData;
    try {
      taskData = JSON.parse(req.body.taskData);
    } catch (error) {
      taskData = req.body;
    }

    // Handle new file attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(file => ({
        filename: file.originalname,
        path: file.path.replace(/\\/g, '/')
      }));
      
      // Combine existing and new attachments
      taskData.attachments = [
        ...(task.attachments || []),
        ...newAttachments
      ];
    }

    // Update task
    task = await Task.findByIdAndUpdate(
      req.params.id,
      taskData,
      {
        new: true,
        runValidators: true
      }
    ).populate(['assignedTo', 'createdBy']);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    // Clean up any uploaded files if there's an error
    if (req.files) {
      req.files.forEach(file => {
        fs.unlink(file.path, err => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    next(err);
  }
}

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export async function deleteTask(req, res, next) {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Update the comparison to use toString()
    if (
      task.createdBy?.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(`User not authorized to delete this task`, 401)
      );
    }

    await task.deleteOne(); // Use deleteOne() instead of remove()

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Generate PDF report of tasks
// @route   GET /api/tasks/generate-pdf
// @access  Private
export async function generateTaskPDF(req, res, next) {
  try {
    let tasks;

    if (req.user.role === "admin") {
      tasks = await Task.find().populate("assignedTo", "name email");
    } else {
      tasks = await Task.find({
        $or: [{ assignedTo: req.user.id }, { createdBy: req.user.id }],
      }).populate("assignedTo", "name email");
    }

    const pdfDoc = await generatePDF(tasks, req.user);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=tasks-report.pdf"
    );

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (err) {
    next(err);
  }
}

// Add new function to handle file deletion
export async function deleteTaskFile(req, res, next) {
  try {
    const { taskId, fileId } = req.params;

    const task = await Task.findById(taskId);
    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${taskId}`, 404)
      );
    }

    const attachment = task.attachments.id(fileId);
    if (!attachment) {
      return next(new ErrorResponse("File not found", 404));
    }

    // Delete file from filesystem
    await fs.unlink(attachment.path);

    // Remove attachment from task
    task.attachments.pull(fileId);
    await task.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
}
