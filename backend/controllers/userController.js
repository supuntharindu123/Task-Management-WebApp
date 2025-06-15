import User from "../models/User.js";
import ErrorResponse from "../utils/errorResponse.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export async function getUsers(req, res, next) {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
export async function updateUser(req, res, next) {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(
        new ErrorResponse(`User not found with id of ${req.params.id}`, 404)
      );
    }

    // Soft delete by setting isActive to false
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
}
