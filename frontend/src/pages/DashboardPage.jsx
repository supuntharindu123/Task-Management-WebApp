import React, { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTasks(data.data);
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tasks Overview</h3>
          <p className="text-3xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Your Role</h3>
          <p className="text-3xl font-bold capitalize">
            {user?.role || "User"}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Welcome</h3>
          <p className="text-xl font-semibold">{user?.name || "Guest"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Pending Tasks</h3>
          <p className="text-3xl font-bold">{pendingTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">In Progress Tasks</h3>
          <p className="text-3xl font-bold">{inProgressTasks}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
          <p className="text-3xl font-bold">{completedTasks}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
