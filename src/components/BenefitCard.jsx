import React from 'react';
// Mock component for Card
const Card = ({ children, className, hover }) => (
    <div 
        className={`${className} rounded-xl border border-gray-200 dark:border-gray-700 ${hover ? 'shadow-lg' : ''}`}
        // The hover effect is integrated via className on the component usage below
    >
        {children}
    </div>
);

// Mock component for Button (using provided logic)
const Button = ({ onClick, className, icon: Icon, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center justify-center px-4 py-2 rounded-xl font-semibold transition duration-300 ${className}`}
    >
        {Icon && <Icon className="w-5 h-5 mr-2" />}
        {children}
    </button>
);

// Mock component for Badge
const Badge = ({ children, className }) => (
    <div className={`text-sm font-semibold px-3 py-1 rounded-full ${className}`}>
        {children}
    </div>
);

import { ArrowRight, DollarSign, CheckCircle } from 'lucide-react'; 

export const BenefitCard = ({ benefit, onSelect }) => {

    // Determine the key metric (coverage or co-pay) for the featured badge
    const isCostMetric = benefit.coverage && benefit.coverage.includes('$');
    const metricText = benefit.coverage || 'Details Vary';

    return (
        <Card 
            hover // Assuming hover prop adds visual lift/shadow
            className="bg-white dark:bg-gray-800 relative h-full flex flex-col justify-between transition-all duration-300 transform hover:shadow-xl hover:border-indigo-400 dark:hover:border-teal-400"
        >
            {/* CREATIVE: HIGH-CONTRAST FEATURE BAR (Replaces the bubble/badge) */}
            <div 
                className={`absolute top-0 left-0 w-full p-3 rounded-t-xl text-center text-white font-extrabold tracking-wide shadow-md z-10
                    bg-gradient-to-r ${isCostMetric ? 'from-red-600 to-red-800' : 'from-teal-500 to-indigo-600'}
                `}
            >
                <span className="text-xs uppercase font-medium mr-1">{isCostMetric ? 'Estimated Cost' : 'Maximum Coverage:'}</span>
                <span className="text-lg">{metricText}</span>
            </div>

            {/* Content Area - INCREASED TOP PADDING (pt-16 was too low, now pt-20) */}
            <div className="p-6 pt-20 flex-grow"> 
                <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 leading-snug">
                    {benefit.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-200 mb-6 leading-relaxed min-h-[4rem]">
                    {benefit.description}
                </p>

                {/* Eligibility Details (Secondary Information) */}
                <div className="mb-6 space-y-2 text-sm pt-4 border-t border-gray-200 dark:border-gray-700">
                    {benefit.eligibility && (
                        <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[90px]">Eligibility:</span>
                            <span className="text-gray-600 dark:text-gray-200">{benefit.eligibility}</span>
                        </div>
                    )}
                    {benefit.details && ( // Placeholder for additional details
                        <div className="flex items-start gap-2">
                            <span className="font-semibold text-gray-700 dark:text-gray-300 min-w-[90px]">Plan Type:</span>
                            <span className="text-gray-600 dark:text-gray-200">{benefit.details}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Button */}
            <div className="p-6 pt-0">
                <Button 
                    onClick={onSelect} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/40 mt-4" 
                    icon={ArrowRight}
                >
                    View Action Plan
                </Button>
            </div>
        </Card>
    );
};
