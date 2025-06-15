import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditTaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    assignedTo: "",
    status: "pending"
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch task data
        const taskResponse = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!taskResponse.ok) throw new Error('Failed to fetch task');
        const taskData = await taskResponse.json();

        // Fetch users
        const usersResponse = await fetch('http://localhost:5000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();

        setUsers(usersData.data);
        setFormData({
          ...taskData.data,
          deadline: new Date(taskData.data.deadline),
          assignedTo: taskData.data.assignedTo?._id
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      navigate('/tasks');
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Deadline</label>
            <DatePicker
              selected={formData.deadline}
              onChange={(date) => setFormData({ ...formData, deadline: date })}
              className="w-full p-2 border rounded"
              dateFormat="MMM dd, yyyy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-2 border rounded"
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
            value={formData.assignedTo || ""}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            className="w-full p-2 border rounded"
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
            onClick={() => navigate('/tasks')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTaskForm;