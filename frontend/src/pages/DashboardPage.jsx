import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import {
  FaTasks,
  FaUserClock,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaCalendarAlt,
  FaUser,
  FaChartLine,
} from "react-icons/fa";
import { format, isAfter } from "date-fns";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTasks(data.data);
        }
      } catch (error) {
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [token]);

  // Task filtering logic
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const completedTasks = tasks.filter((task) => task.status === "completed");
  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "completed" && isAfter(new Date(), new Date(task.deadline))
  );

  // Get tasks due today
  const today = new Date();
  const dueTodayTasks = tasks.filter(
    (task) =>
      format(new Date(task.deadline), "yyyy-MM-dd") ===
      format(today, "yyyy-MM-dd")
  );

  const StatusCard = ({
    title,
    count,
    icon: Icon,
    color,
    bgColor,
    onClick,
  }) => (
    <div
      onClick={onClick}
      className={`${bgColor} p-6 rounded-lg shadow-md transition-transform hover:scale-105 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{count}</p>
        </div>
        <Icon className={`text-4xl ${color}`} />
      </div>
    </div>
  );

  const TaskList = ({ tasks, emptyMessage }) => (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-gray-500">{emptyMessage}</p>
      ) : (
        tasks.map((task) => (
          <Link
            key={task._id}
            to={`/tasks/${task._id}`}
            className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <div className="flex items-center space-x-4 mt-1">
                  <p className="text-sm text-gray-500">
                    <FaUser className="inline mr-1" />
                    {task.assignedTo?.name || "Unassigned"}
                  </p>
                  <p className="text-sm text-gray-500">
                    <FaCalendarAlt className="inline mr-1" />
                    {format(new Date(task.deadline), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  task.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {task.status.replace("-", " ")}
              </span>
            </div>
          </Link>
        ))
      )}
    </div>
  );

  if (loading)
    return <div className="text-center py-8">Loading dashboard...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}!{" "}
            </h1>
            <p className="text-blue-100">
              You have {dueTodayTasks.length} tasks due today and{" "}
              {overdueTasks.length} overdue tasks
            </p>
          </div>
          <FaChartLine className="text-5xl text-blue-100 opacity-50" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatusCard
          title="Total Tasks"
          count={tasks.length}
          icon={FaTasks}
          color="text-blue-600"
          bgColor="bg-blue-50"
        />
        <StatusCard
          title="Pending Tasks"
          count={pendingTasks.length}
          icon={FaClock}
          color="text-yellow-600"
          bgColor="bg-yellow-50"
        />
        <StatusCard
          title="In Progress"
          count={inProgressTasks.length}
          icon={FaUserClock}
          color="text-indigo-600"
          bgColor="bg-indigo-50"
        />
        <StatusCard
          title="Completed"
          count={completedTasks.length}
          icon={FaCheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
        />
      </div>

      {/* Task Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks Due Today & Overdue */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedPeriod("today")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedPeriod === "today"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Due Today
              </button>
              <button
                onClick={() => setSelectedPeriod("overdue")}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedPeriod === "overdue"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                Overdue
              </button>
            </div>
            <FaExclamationTriangle
              className={
                selectedPeriod === "overdue"
                  ? "text-red-500"
                  : "text-yellow-500"
              }
            />
          </div>
          <TaskList
            tasks={
              selectedPeriod === "today"
                ? dueTodayTasks
                : overdueTasks
            }
            emptyMessage={`No ${
              selectedPeriod === "today"
                ? "tasks due today"
                : "overdue tasks"
            }`}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6">Recent Tasks</h2>
          <TaskList tasks={tasks.slice(0, 5)} emptyMessage="No recent tasks" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
