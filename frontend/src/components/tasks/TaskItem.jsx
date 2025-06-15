import React from "react";
import { format, isPast, isToday } from "date-fns";
import { FaCalendarAlt, FaUser, FaClock, FaFlag } from "react-icons/fa";

const TaskItem = ({ task }) => {
  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const isOverdue =
    isPast(new Date(task.deadline)) && task.status !== "completed";
  const isDueToday = isToday(new Date(task.deadline));

  return (
    <div className="p-4 hover:bg-gray-50 transition-all duration-200">
      <div className="space-y-3">
        {/* Title and Status */}
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg text-gray-900 flex-1">
            {task.title}
            {isOverdue && (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                Overdue
              </span>
            )}
            {isDueToday && !isOverdue && (
              <span className="ml-2 text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                Due Today
              </span>
            )}
          </h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusClasses[task.status]
            }`}
          >
            {task.status.replace("-", " ")}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">{task.description}</p>

        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-400" />
            <span className={isOverdue ? "text-red-600 font-medium" : ""}>
              {format(new Date(task.deadline), "MMM dd, yyyy")}
            </span>
          </div>

          <div className="flex items-center">
            <FaUser className="mr-2 text-gray-400" />
            <span>{task.assignedTo?.name || "Unassigned"}</span>
          </div>

          <div className="flex items-center">
            <FaClock className="mr-2 text-gray-400" />
            <span>Created {format(new Date(task.createdAt), "MMM dd")}</span>
          </div>

          {task.priority && (
            <div className="flex items-center">
              <FaFlag className="mr-2 text-gray-400" />
              <span className="capitalize">{task.priority}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
