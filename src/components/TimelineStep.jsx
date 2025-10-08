import React from 'react';
import { Check } from 'lucide-react';

export const TimelineStep = ({ index, text, completed, onToggle }) => {
  return (
    <div className="relative">
      <div className="absolute -left-1.5 top-0">
        {/* Step Icon: Updated Colors */}
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full text-white font-bold flex items-center justify-center shadow-lg ${
          completed 
            ? 'bg-cyan-600 shadow-cyan-500/40' // New Completion Color
            : 'bg-fuchsia-600 shadow-fuchsia-500/40' // New Active Color
        }`}>
          {completed ? <Check className="w-6 h-6" /> : index + 1}
        </div>
      </div>
      <div
        // Step Card: Applied Glassmorphism and New Colors for Sleek Look
        className={`ml-6 md:ml-8 p-5 md:p-6 rounded-xl border transition cursor-pointer ${
          completed
            ? 'bg-cyan-50 border-cyan-300 dark:bg-cyan-900/30 dark:border-cyan-700' // Completed State
            : 'bg-white border-gray-300 hover:bg-gray-50 dark:bg-gray-800/20 dark:border-gray-700 dark:hover:bg-gray-700/30' // Pending State
        } backdrop-blur-sm animate-in slide-in-from-bottom-${(index % 4) + 4}`}
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
            ? 'text-cyan-900 line-through dark:text-cyan-200' 
            : 'text-gray-800 dark:text-gray-100'
        }`}>
          {text}
        </p>
      </div>
    </div>
  );
};