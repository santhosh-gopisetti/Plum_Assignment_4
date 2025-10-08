import React from 'react';
import { Check } from 'lucide-react';

export const TimelineStep = ({ index, text, completed, onToggle }) => {
  return (
    <div className="relative">
      {/* Step Icon: Repositioned to center over the timeline line */}
      <div className="absolute -left-5 top-0 flex items-center justify-center w-10 h-10 md:w-12 md:h-12">
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full text-white font-bold flex items-center justify-center shadow-lg ${
          completed 
            ? 'bg-teal-600 shadow-teal-500/40' // New Completion Color (Teal)
            : 'bg-indigo-600 shadow-indigo-500/40' // New Active Color (Indigo)
        }`}>
          {completed ? <Check className="w-6 h-6" /> : index + 1}
        </div>
      </div>
      <div
        // Step Card: Increased left margin (ml-12) to clear the absolute circle
        className={`ml-10 md:ml-12 p-5 md:p-6 rounded-xl border transition cursor-pointer ${
          completed
            ? 'bg-teal-50 border-teal-300 hover:bg-teal-100 dark:bg-teal-900/30 dark:border-teal-700' // Completed State
            : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800/20 dark:hover:bg-gray-700/30' // Pending State
        } backdrop-blur-sm`}
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
        {/* Step Text: Updated Color and Line-through for completion */}
        <p className={`text-lg leading-relaxed ${
          completed 
            ? 'text-teal-900 line-through dark:text-teal-200' 
            : 'text-gray-800 dark:text-gray-100'
        }`}>
          {text}
        </p>
      </div>
    </div>
  );
};