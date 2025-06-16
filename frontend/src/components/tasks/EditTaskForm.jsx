import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import DatePicker from "react-datepicker";
import { FaPaperclip, FaTimes, FaTrash } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import Alert from '../common/Alert';

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
  const [alert, setAlert] = useState(null);
  const [files, setFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskResponse = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!taskResponse.ok) throw new Error('Failed to fetch task');
        const taskData = await taskResponse.json();

        // Set existing files
        setExistingFiles(taskData.data.attachments || []);

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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeNewFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingFile = async (fileId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}/files/${fileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      setExistingFiles(prev => prev.filter(file => file._id !== fileId));
      setAlert({
        type: 'success',
        message: 'File deleted successfully'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setUploading(true);

    try {
      const formDataToSend = new FormData();
      
      // Add task data
      const taskData = {
        ...formData,
        deadline: formData.deadline.toISOString()
      };
      formDataToSend.append('taskData', JSON.stringify(taskData));

      // Add new files
      files.forEach(file => {
        formDataToSend.append('files', file);
      });

      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          type: 'success',
          message: 'Task updated successfully'
        });
        setTimeout(() => navigate('/tasks'), 1500);
      } else {
        throw new Error(data.message || 'Failed to update task');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
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

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Attachments
          </label>
          
          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-600 mb-2">Current Files:</h4>
              <div className="space-y-2">
                {existingFiles.map((file) => (
                  <div key={file._id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm truncate">{file.filename}</span>
                    <div className="flex items-center space-x-2">
                      <a
                        href={`http://localhost:5000/${file.path}`}
                        download
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FaPaperclip />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDeleteExistingFile(file._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Files */}
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
              <FaPaperclip className="inline mr-2" />
              Add Files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
            </label>
            <span className="text-sm text-gray-500">
              Max 5 files (5MB each)
            </span>
          </div>

          {/* New Files Preview */}
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeNewFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
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