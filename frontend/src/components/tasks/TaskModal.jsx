import React from "react";
import { format } from "date-fns";
import { FaTimes } from "react-icons/fa";

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-600">Description</h3>
            <p className="mt-1">{task.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-600">Status</h3>
              <span
                className={`inline-block px-2 py-1 rounded-full text-sm mt-1 ${
                  statusColors[task.status]
                }`}
              >
                {task.status.replace("-", " ")}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600">Deadline</h3>
              <p className="mt-1">
                {format(new Date(task.deadline), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-600">
                Assigned To
              </h3>
              <p className="mt-1">{task.assignedTo?.name || "Unassigned"}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-600">Created By</h3>
              <p className="mt-1">{task.createdBy?.name || "System"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600">Created At</h3>
            <p className="mt-1">
              {format(new Date(task.createdAt), "MMM dd, yyyy HH:mm")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;