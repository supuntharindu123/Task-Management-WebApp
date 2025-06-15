import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useAuth } from "../../utils/AuthContext";

const TaskItem = ({ task, onTasksChange }) => {
  const { role, id } = useAuth();

  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // Prevent modal from opening when clicking delete
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (response.ok) {
        onTasksChange(); // Refresh task list
      } else {
        throw new Error(data.message || "Failed to delete task");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert(error.message);
    }
  };

  // Update the comparison to use task.createdBy._id since it's populated
  const canModify = role === "admin" || task.createdBy?._id === id;

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-gray-600 mt-1">{task.description}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                statusClasses[task.status]
              }`}
            >
              {task.status.replace("-", " ")}
            </span>
            <span className="text-sm text-gray-500">
              Due: {format(new Date(task.deadline), "MMM dd, yyyy")}
            </span>
            <span className="text-sm text-gray-500">
              Assigned to: {task.assignedTo?.name || "Unassigned"}
            </span>
          </div>
        </div>

        {canModify && (
          <div className="flex space-x-2 ml-4" onClick={e => e.stopPropagation()}>
            <Link
              to={`/tasks/${task._id}/edit`}
              className="text-blue-600 hover:text-blue-800"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
