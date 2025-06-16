import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  FaBold,
  FaItalic,
  FaListUl,
  FaHeading,
  FaLink,
  FaPaperclip,
  FaTimes,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import Alert from "../common/Alert";
import { createTask } from "../../store/actions/taskActions";

const TaskForm = () => {
  const navigate = useNavigate();
  const { id, user, token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    assignedTo: "",
    status: "pending",
    createdBy: id, // Add createdBy field with admin ID
  });
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [alert, setAlert] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

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

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);
    setUploading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.assignedTo) {
        throw new Error("Please fill in all required fields");
      }

      const formDataToSend = new FormData();

      // Add task data as a JSON string
      const taskData = {
        ...formData,
        deadline: formData.deadline.toISOString(), // Convert date to ISO string
      };

      formDataToSend.append("taskData", JSON.stringify(taskData));

      // Add files if any
      files.forEach((file) => {
        formDataToSend.append("files", file);
      });

      console.log("Sending task data:", taskData); // Debug log

      const result = await createTask(formDataToSend);

      if (result.success) {
        setAlert({
          type: "success",
          message: "Task created successfully",
        });
        setTimeout(() => navigate("/tasks"), 1500);
      } else {
        throw new Error(result.error || "Failed to create task");
      }
    } catch (error) {
      console.error("Task creation error:", error);
      setAlert({
        type: "error",
        message: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const insertFormatting = (type) => {
    const input = document.getElementById("description");
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = formData.description;
    let insertion = "";

    switch (type) {
      case "bold":
        insertion = `**${text.substring(start, end) || "bold text"}**`;
        break;
      case "italic":
        insertion = `_${text.substring(start, end) || "italic text"}_`;
        break;
      case "list":
        insertion = `\n- ${text.substring(start, end) || "list item"}`;
        break;
      case "heading":
        insertion = `\n### ${text.substring(start, end) || "heading"}`;
        break;
      case "link":
        insertion = `[${text.substring(start, end) || "link text"}](url)`;
        break;
      default:
        return;
    }

    setFormData({
      ...formData,
      description: text.substring(0, start) + insertion + text.substring(end),
    });
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <h2 className="text-2xl font-bold mb-6">Create Task</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            placeholder="Enter a clear, concise task title"
            required
            aria-describedby="title-description"
          />
          <p id="title-description" className="mt-1 text-sm text-gray-500">
            Keep it short and descriptive (e.g., "Prepare Q4 Sales Report")
          </p>
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <div className="mb-2 flex space-x-2">
            <button
              type="button"
              onClick={() => insertFormatting("bold")}
              className="p-2 hover:bg-gray-100 rounded"
              title="Bold"
            >
              <FaBold />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("italic")}
              className="p-2 hover:bg-gray-100 rounded"
              title="Italic"
            >
              <FaItalic />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("list")}
              className="p-2 hover:bg-gray-100 rounded"
              title="List"
            >
              <FaListUl />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("heading")}
              className="p-2 hover:bg-gray-100 rounded"
              title="Heading"
            >
              <FaHeading />
            </button>
            <button
              type="button"
              onClick={() => insertFormatting("link")}
              className="p-2 hover:bg-gray-100 rounded"
              title="Link"
            >
              <FaLink />
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className={`px-3 py-1 rounded ${
                showPreview ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
              }`}
            >
              {showPreview ? "Edit" : "Preview"}
            </button>
          </div>

          {showPreview ? (
            <div className="p-3 border rounded min-h-[150px] prose prose-sm max-w-none">
              <ReactMarkdown>{formData.description}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows="6"
              placeholder="Use markdown formatting:
** ** for bold
_ _ for italic
- for lists
### for headings
[text](url) for links"
              required
              aria-describedby="description-description"
            ></textarea>
          )}
          <p
            id="description-description"
            className="mt-1 text-sm text-gray-500"
          >
            Use the formatting buttons above or markdown syntax for styling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium mb-1"
            >
              Deadline <span className="text-red-500">*</span>
            </label>
            <DatePicker
              id="deadline"
              selected={formData.deadline}
              onChange={(date) =>
                setFormData((prev) => ({ ...prev, deadline: date }))
              }
              minDate={new Date()}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              dateFormat="MMMM d, yyyy"
              required
              aria-describedby="deadline-description"
            />
            <p id="deadline-description" className="mt-1 text-sm text-gray-500">
              Select a date when the task should be completed
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              required
              aria-describedby="status-description"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <p id="status-description" className="mt-1 text-sm text-gray-500">
              Current state of the task
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="assignedTo"
            className="block text-sm font-medium mb-1"
          >
            Assign To <span className="text-red-500">*</span>
          </label>
          <select
            id="assignedTo"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            required
            aria-describedby="assigned-description"
          >
            <option value="">Select team member</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
          <p id="assigned-description" className="mt-1 text-sm text-gray-500">
            Choose the team member responsible for this task
          </p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Attachments (optional)
          </label>
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
          {files.length > 0 && (
            <div className="mt-2 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            {uploading ? "Creating Task..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
