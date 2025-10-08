import React from 'react';
import { useFlow } from '../context/FlowContext';
import { CheckCircle2, ArrowLeft, Award, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { BenefitCard } from './BenefitCard'; // Assuming this component exists
import { ScreenContainer } from './ui/ScreenContainer';

export const BenefitsScreen = () => {
    // Destructure all necessary state and setters from the global context
    const { aiCategory, benefits, setSelectedBenefit, setCurrentScreen, setBenefits, setAiCategory } = useFlow();

    const handleGetActionPlan = (benefit) => {
        setSelectedBenefit(benefit);
        setCurrentScreen('action-plan');
    };

    const handleBack = () => {
        // Clear the generated data and return to the input screen for a fresh start
        setBenefits([]);
        setAiCategory('');
        setCurrentScreen('input');
    };

    // --- UI RENDER ---
    return (
        <ScreenContainer className="py-12 px-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-5xl mx-auto">
                
                {/* Step Indicator & Back Button (Top Fixed) */}
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50/90 dark:bg-gray-950/90 z-20 py-2 rounded-lg">
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all transform hover:-translate-x-1 animate-in slide-in-from-left-4"
                        aria-label="Start over"
                    >
                        <ArrowLeft className="w-5 h-5 text-indigo-600 dark:text-teal-400" />
                        <span className="font-medium">New Search</span>
                    </button>
                    
                </div>

                {/* Header Card: Success and Overview */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-10 mb-8 animate-in slide-in-from-top-4 duration-700">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="relative pt-1"> 
                            {/* Icon: Updated to Purple/Teal Success Color */}
                            <div className="relative bg-gradient-to-br from-teal-500 to-indigo-600 p-3 rounded-full shadow-lg">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 capitalize tracking-tight">
                                    {aiCategory} Options Ready
                                </h1>
                                <Award className="w-7 h-7 text-yellow-500 animate-in zoom-in duration-1000" />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-lg">
                                We found <span className="font-extrabold text-indigo-600 dark:text-teal-400">{benefits.length}</span> benefit{benefits.length !== 1 ? 's' : ''} that match your needs.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-6">
                        <p className="text-lg text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                            <Info className="w-5 h-5 text-indigo-600 dark:text-teal-400" />
                            Select the best fit to get your personalized 3-step action plan.
                        </p>
                    </div>
                </div>

                {/* CREATIVE LAYOUT: Broken Grid for Comparative Selection */}
                {benefits.length === 0 ? (
                    // Empty State: Use the existing clean Card component
                    <Card className="p-12 text-center bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 animate-in zoom-in duration-500">
                        <div className="mb-4">
                            <Info className="w-16 h-16 text-indigo-500 mx-auto" />
                        </div>
                        <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">
                            We couldn't find specific benefits for "{aiCategory}". Please refine your search or start over.
                        </p>
                        <Button onClick={handleBack} variant="primary" size="lg" className="bg-indigo-600 hover:bg-indigo-700 shadow-md text-white">
                            Try a Different Search
                        </Button>
                    </Card>
                ) : (
                    // --- BROKEN GRID IMPLEMENTATION ---
                    <div className="grid md:grid-cols-3 gap-6 auto-rows-fr">
                        {benefits.map((benefit, index) => (
                            <div 
                                key={benefit.title} 
                                // Creative Grid Logic: Make the first card span 2 columns if 3 or 4 results, or 2 rows if 4 results
                                className={`
                                    ${benefits.length === 3 && index === 0 ? 'md:col-span-2' : ''} 
                                    ${benefits.length === 4 && index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                                    ${benefits.length === 4 && index === 1 ? 'md:col-span-1 md:row-span-2' : ''}
                                    ${benefits.length === 4 && index > 1 ? 'md:col-span-1 md:row-span-1' : ''}
                                    animate-in slide-in-from-bottom-4 duration-500 delay-${index * 100}
                                `}
                            >
                                {/* BenefitCard is assumed to display the creative Comparative Metric/Badge */}
                                <BenefitCard benefit={benefit} onSelect={() => handleGetActionPlan(benefit)} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Hint - Simple Background */}
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-300 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-700">
                    <p className="text-gray-700 dark:text-gray-300">
                        <span className="font-semibold text-indigo-600 dark:text-teal-400"></span> Each action plan will guide you step-by-step through accessing the benefit.
                    </p>
                </div>
            </div>
        </ScreenContainer>
    );
};