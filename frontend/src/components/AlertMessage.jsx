import React from 'react';

const AlertMessage = ({ message, type }) => {
  const baseStyle = "p-3 rounded-md text-sm font-medium";
  const typeStyles = {
    success: "bg-green-100 text-green-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  return (
    <div className={`${baseStyle} ${typeStyles[type] || typeStyles.info}`}>
      {message}
    </div>
  );
};

export default AlertMessage;
