import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import TaskItem from "./TaskItem";
import TaskModal from "./TaskModal";

const TaskList = () => {
  const { token, role, id } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    deadline: "",
    sort: "-createdAt",
  });
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      // If admin, show all tasks. If user, filter tasks
      const filteredTasks =
        role === "admin"
          ? data.data
          : data.data.filter(
              (task) =>
                task.assignedTo?._id === id || task.createdBy?._id === id
            );

      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/tasks/generate-pdf",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from useAuth
            Accept: "application/pdf",
          },
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tasks-report-${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Failed to generate PDF report");
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  useEffect(() => {
    fetchTasks();
  }, [token, role, id, filters]);

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Error loading tasks: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleGeneratePDF}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
          >
            Generate PDF
          </button>
          {role === "admin" && (
            <Link
              to="/tasks/new"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Add Task
            </Link>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Deadline Filter */}
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.deadline}
            onChange={(e) => handleFilterChange("deadline", e.target.value)}
          >
            <option value="">All Deadlines</option>
            <option value="today">Due Today</option>
            <option value="week">Due This Week</option>
            <option value="month">Due This Month</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          {Object.entries(filters).map(([key, value]) => {
            if (value && key !== "sort") {
              return (
                <span
                  key={key}
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, "")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              );
            }
            return null;
          })}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-8">No tasks found</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <div
                key={task._id}
                onClick={() => handleTaskClick(task)}
                className="cursor-pointer"
              >
                <TaskItem
                  task={task}
                  isAdmin={role === "admin"}
                  userId={id}
                  onTasksChange={fetchTasks}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
};

export default TaskList;
