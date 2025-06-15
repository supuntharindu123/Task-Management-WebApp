import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";
import { Link } from "react-router-dom";
import {
  FaTasks,
  FaUserClock,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { format } from "date-fns";

const Dashboard = () => {
  const { user, token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  );
  const completedTasks = tasks.filter((task) => task.status === "completed");

  // Get tasks due today
  const today = new Date();
  const dueTodayTasks = tasks.filter(
    (task) =>
      format(new Date(task.deadline), "yyyy-MM-dd") ===
      format(today, "yyyy-MM-dd")
  );

  const StatusCard = ({ title, count, icon: Icon, color, bgColor }) => (
    <div className={`${bgColor} p-6 rounded-lg shadow-md transition-transform hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{count}</p>
        </div>
        <Icon className={`text-4xl ${color}`} />
      </div>
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
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}!{" "}
        </h1>
        <p className="text-blue-100">
          You have {dueTodayTasks.length} tasks due today
        </p>
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

      {/* Recent Tasks & Due Today */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks Due Today */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Due Today</h2>
            <FaExclamationTriangle className="text-yellow-500" />
          </div>
          <div className="space-y-4">
            {dueTodayTasks.length === 0 ? (
              <p className="text-gray-500">No tasks due today</p>
            ) : (
              dueTodayTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        Assigned to: {task.assignedTo?.name}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : task.status === "in-progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{task.title}</h3>
                    <p className="text-sm text-gray-500">
                      Due: {format(new Date(task.deadline), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
