import React from 'react';
import { useFlow } from '../context/FlowContext';
import { CheckCircle2, ArrowLeft, Award, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { BenefitCard } from './BenefitCard';
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
        // FIX: Default light mode background
        <ScreenContainer className="py-12 px-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-5xl mx-auto">
                {/* Back Button / Start Over */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-8 transition-all transform hover:-translate-x-1 animate-in slide-in-from-left-4"
                    aria-label="Start over"
                >
                    {/* Increased font size to text-lg */}
                    <ArrowLeft className="w-6 h-6 text-indigo-600 dark:text-teal-400" />
                    <span className="font-semibold text-lg">Start Over</span>
                </button>

                {/* Header Card: Clean, simple shadow and border */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 mb-10 animate-in slide-in-from-top-4 duration-700">
                    <div className="flex items-start gap-5 mb-6">
                        <div className="relative">
                            {/* Icon: Updated to Purple/Teal Success Color */}
                            <div className="absolute inset-0 bg-teal-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-teal-500 to-indigo-600 p-4 rounded-full shadow-lg">
                                {/* Increased Icon size from w-8 h-8 to w-10 h-10 */}
                                <CheckCircle2 className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-3 mb-2">
                                {/* Increased title size from text-3xl/4xl to text-4xl/5xl */}
                                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 capitalize leading-tight">
                                    {aiCategory} Benefits Found
                                </h1>
                                {/* Increased Icon size from w-6 h-6 to w-8 h-8 */}
                                <Award className="w-8 h-8 text-yellow-400" />
                            </div>
                            {/* Increased descriptive text from text-lg to text-xl */}
                            <p className="text-gray-700 dark:text-gray-300 text-xl mt-1">
                                We found <span className="font-bold text-indigo-600 dark:text-teal-400">{benefits.length}</span> benefit{benefits.length !== 1 ? 's' : ''} that match your needs.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-6 mt-4">
                        {/* Increased instruction text from text-lg to text-xl */}
                        <p className="text-xl text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-3">
                            <Info className="w-6 h-6 text-indigo-600 dark:text-teal-400" />
                            Based on your needs, here are the benefits available to you:
                        </p>
                        {/* Increased hint text from text-sm to text-base */}
                        <p className="text-base text-gray-600 dark:text-gray-400 ml-9">
                            Select any benefit to get a personalized action plan.
                        </p>
                    </div>
                </div>

                {/* Conditional Rendering: List Benefits or Show Empty State */}
                {benefits.length === 0 ? (
                    <Card className="p-16 text-center bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 animate-in zoom-in duration-500">
                        <div className="mb-6">
                            {/* Increased Icon size from w-16 h-16 to w-20 h-20 */}
                            <Info className="w-20 h-20 text-indigo-500 mx-auto" />
                        </div>
                        {/* Increased empty state message from text-xl to text-2xl */}
                        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 font-medium">
                            We couldn't find specific benefits for **"{aiCategory}"**. Please refine your search or start over.
                        </p>
                        <Button onClick={handleBack} variant="primary" size="xl" className="bg-indigo-600 hover:bg-indigo-700 shadow-xl text-white">
                            Try a Different Search
                        </Button>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {benefits.map((benefit, index) => (
                            <div 
                                key={benefit.title} 
                                className={`animate-in slide-in-from-bottom-4 duration-500 delay-${index * 100}`}
                            >
                                {/* NOTE: BenefitCard text sizes will need to be updated internally as well, but the container classes are fine here */}
                                <BenefitCard benefit={benefit} onSelect={() => handleGetActionPlan(benefit)} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Hint - Simple Background */}
                <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-300 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-700">
                    {/* Increased footer text from text-gray-700 (default size) to text-lg */}
                    <p className="text-lg text-gray-700 dark:text-gray-300">
                        <span className="font-bold text-indigo-600 dark:text-teal-400">Need help choosing?</span> Each action plan will guide you step-by-step through accessing the benefit.
                    </p>
                </div>
            </div>
        </ScreenContainer>
    );
};