import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-usiuBlue"></div>
      <p className="ml-3 text-usiuBlue">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
