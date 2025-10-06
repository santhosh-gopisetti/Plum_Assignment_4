import React from 'react';
import { Check } from 'lucide-react';

export const TimelineStep = ({ index, text, completed, onToggle }) => {
  return (
    <div className="relative">
      <div className="absolute -left-1.5 top-0">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${completed ? 'bg-green-600' : 'bg-indigo-600'} text-white font-bold flex items-center justify-center shadow-lg`}>
          {completed ? <Check className="w-6 h-6" /> : index + 1}
        </div>
      </div>
      <div
        className={`ml-6 md:ml-8 p-5 md:p-6 rounded-xl border transition cursor-pointer ${
          completed
            ? 'bg-green-50 border-green-200 dark:bg-green-900/30 dark:border-green-700'
            : 'bg-white border-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700'
        } animate-in slide-in-from-bottom-${(index % 4) + 4}`}
        onClick={onToggle}
        role="checkbox"
        aria-checked={completed}
        tabIndex={0}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <p className={`text-lg leading-relaxed ${completed ? 'text-green-900 dark:text-green-100 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
          {text}
        </p>
      </div>
    </div>
  );
};


