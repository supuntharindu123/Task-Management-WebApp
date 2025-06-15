import Task from "../models/Task.js";
import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";
import generatePDF from "../utils/generatePDF.js";

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export async function getTasks(req, res, next) {
  try {
    // console.log("User requesting tasks:", req.user);

    // Filtering
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
export async function createTask(req, res, next) {
  try {
    // console.log(req.user.id);
    // // Add user to req.body
    // req.body.createdBy = req.user.id;

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export async function updateTask(req, res, next) {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return next(
        new ErrorResponse(`Task not found with id of ${req.params.id}`, 404)
      );
    }

    // Make sure user is task owner or admin
    if (
      task.assignedTo.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return next(
        new ErrorResponse(`User not authorized to update this task`, 401)
      );
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
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
