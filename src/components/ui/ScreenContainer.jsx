import React from 'react';

export const ScreenContainer = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 ${className}`}>
      {children}
    </div>
  );
};


