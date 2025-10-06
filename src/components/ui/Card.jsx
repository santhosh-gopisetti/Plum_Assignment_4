import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-0.5 transition' : '';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-7 ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
