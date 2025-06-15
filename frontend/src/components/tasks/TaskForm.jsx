import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const TaskForm = () => {
  const navigate = useNavigate();
  const { id, user, token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    assignedTo: "",
    status: "pending",
    createdBy: user?._id, // Add createdBy field with admin ID
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        console.log("Users data:", data); // Debug log
        setUsers(data.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        createdBy: id, // Ensure admin ID is included in submission
      };

      console.log("Submitting task data:", taskData); // Debug log

      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      console.log("Response:", response); // Debug log

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      navigate("/tasks");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create Task</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <DatePicker
              selected={formData.deadline}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, deadline: date }))
              }
              minDate={new Date()}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              dateFormat="MMMM d, yyyy"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Assign To</label>
          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
