import React from 'react';

const Alert = ({ type, message, onClose }) => {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  return (
    <div className={`${colors[type]} border p-4 rounded-md relative mb-4`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Alert;