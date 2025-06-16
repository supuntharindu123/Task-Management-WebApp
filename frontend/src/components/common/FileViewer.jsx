import React, { useState } from "react";
import { FaTimes, FaSpinner } from "react-icons/fa";

const FileViewer = ({ file, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getFileType = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "image";
    if (["pdf"].includes(ext)) return "pdf";
    if (["doc", "docx"].includes(ext)) return "doc";
    return "other";
  };

  const fileType = getFileType(file.filename);
  const fileUrl = `http://localhost:5000/${file.path}`;

  const handleImageLoad = () => {
    setLoading(false);
  };

  const handleImageError = () => {
    setLoading(false);
    setError("Failed to load file");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">{file.filename}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-4 relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <FaSpinner className="animate-spin text-blue-600 text-3xl" />
            </div>
          )}

          {error && <div className="text-center text-red-600 p-4">{error}</div>}

          {fileType === "image" && (
            <img
              src={fileUrl}
              alt={file.filename}
              className="max-w-full max-h-[70vh] mx-auto"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: loading ? "none" : "block" }}
            />
          )}
          {fileType === "pdf" && (
            <object
              data={fileUrl}
              type="application/pdf"
              className="w-full h-[70vh]"
              onLoad={() => setLoading(false)}
              onError={handleImageError}
            >
              <p>
                PDF preview not available.{" "}
                <a
                  href={fileUrl}
                  className="text-blue-600 hover:underline"
                  download
                >
                  Download instead
                </a>
              </p>
            </object>
          )}
          {(fileType === "doc" || fileType === "other") && (
            <div className="text-center p-8">
              <p>Preview not available for this file type</p>
              <a
                href={fileUrl}
                download
                className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setLoading(false)}
              >
                Download File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileViewer;
