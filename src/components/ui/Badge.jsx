import React from 'react';

export const Badge = ({ children, className = '', color = 'teal', ...props }) => {
  const colorClasses = {
    teal: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-200',
    indigo: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-200',
    gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200',
    green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};


