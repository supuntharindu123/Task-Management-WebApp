import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

const TaskDetailPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTask(data.data);
        }
      } catch (error) {
        console.error("Error fetching task:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!task) {
    return <div className="text-center py-8">Task not found</div>;
  }

  const statusClasses = {
    pending: "bg-yellow-100 text-yellow-800",
    "in-progress": "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Task Details</h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-2xl">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <p className="text-gray-900 text-lg">{task.title}</p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <p className="text-gray-900">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Status
            </label>
            <span
              className={`px-2 py-1 text-xs rounded-full ${
                statusClasses[task.status]
              }`}
            >
              {task.status.replace("-", " ")}
            </span>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Deadline
            </label>
            <p className="text-gray-900">
              {format(new Date(task.deadline), "MMM dd, yyyy")}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Assigned To
          </label>
          <p className="text-gray-900">
            {task.assignedTo?.name || "Unassigned"}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Created By
          </label>
          <p className="text-gray-900">{task.createdBy?.name || "System"}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
