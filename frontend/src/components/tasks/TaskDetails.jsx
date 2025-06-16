import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaPaperclip,
  FaDownload,
} from "react-icons/fa";
import FileViewer from "../common/FileViewer";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, role, id: userId } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTask(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch task");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, token]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        navigate("/tasks");
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete task");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this attachment?"))
      return;

    try {
      // Add debug logging
      console.log("File path:", `http://localhost:5000/${file.path}`);

      const response = await fetch(
        `http://localhost:5000/api/tasks/${id}/attachments/${fileId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setTask((prevTask) => ({
          ...prevTask,
          attachments: prevTask.attachments.filter((file) => file._id !== fileId),
        }));
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete attachment");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      setError(error.message);
    }
  };

  if (loading) return <div className="text-center py-8">Loading task...</div>;
  if (error)
    return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!task) return <div className="text-center py-8">Task not found</div>;

  const canModify = role === "admin" || task.createdBy?._id === userId;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          {canModify && (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(`/tasks/${id}/edit`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <FaEdit className="mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Task Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{task.title}</h1>

            {/* Status Badge */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm ${
                task.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : task.status === "in-progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {task.status.replace("-", " ")}
            </span>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                <ReactMarkdown>{task.description}</ReactMarkdown>
              </p>
            </div>

            {/* Task Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FaCalendarAlt className="mr-2" />
                  <div>
                    <p className="text-sm">Deadline</p>
                    <p className="font-medium">
                      {format(new Date(task.deadline), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaClock className="mr-2" />
                  <div>
                    <p className="text-sm">Created</p>
                    <p className="font-medium">
                      {format(new Date(task.createdAt), "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2" />
                  <div>
                    <p className="text-sm">Assigned To</p>
                    <p className="font-medium">
                      {task.assignedTo?.name || "Unassigned"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUser className="mr-2" />
                  <div>
                    <p className="text-sm">Created By</p>
                    <p className="font-medium">
                      {task.createdBy?.name || "System"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments */}
            {task.attachments && task.attachments.length > 0 && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Attachments</h2>
                <div className="space-y-2">
                  {task.attachments.map((file) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                    >
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setSelectedFile(file)}
                      >
                        <FaPaperclip className="text-gray-400 mr-2" />
                        <span className="text-sm">{file.filename}</span>
                      </div>
                      <div className="flex space-x-2">
                        <a
                          href={`http://localhost:5000/${file.path}`}
                          download
                          className="text-blue-600 hover:text-blue-800"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FaDownload />
                        </a>
                        {canModify && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteFile(file._id);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* File Viewer Modal */}
            {selectedFile && (
              <FileViewer
                file={selectedFile}
                onClose={() => setSelectedFile(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
