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
        <ScreenContainer className="py-12 px-6 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">
                {/* Back Button / Start Over */}
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-all transform hover:-translate-x-1 animate-in slide-in-from-left-4"
                    aria-label="Start over"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Start Over</span>
                </button>

                {/* Header Card: AI Classification Result */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-10 mb-8 animate-in slide-in-from-top-4 duration-700">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-lg">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center gap-2 mb-2">
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white capitalize">
                                    {aiCategory} Benefits Found
                                </h1>
                                <Award className="w-6 h-6 text-yellow-500" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-100 text-lg">
                                We found <span className="font-bold text-indigo-600">{benefits.length}</span> benefit{benefits.length !== 1 ? 's' : ''} that match your needs.
                            </p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <p className="text-lg text-gray-700 dark:text-gray-100 mb-2 flex items-center gap-2">
                            <Info className="w-5 h-5 text-indigo-600" />
                            Based on your needs, here are the benefits available to you:
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-300 ml-7">
                            Select any benefit to get a personalized action plan.
                        </p>
                    </div>
                </div>

                {/* Conditional Rendering: List Benefits or Show Empty State */}
                {benefits.length === 0 ? (
                    <Card className="p-12 text-center animate-in zoom-in duration-500">
                        <div className="mb-4">
                            <Info className="w-16 h-16 text-gray-400 mx-auto" />
                        </div>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                            We couldn't find specific benefits for "{aiCategory}". Please refine your search or start over.
                        </p>
                        <Button onClick={handleBack} variant="primary" size="lg">
                            Try a Different Search
                        </Button>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            // Staggered animation for better UI/UX
                            <div 
                                key={benefit.title} 
                                className={`animate-in slide-in-from-bottom-4 duration-500 delay-${index * 100}`}
                            >
                                <BenefitCard benefit={benefit} onSelect={() => handleGetActionPlan(benefit)} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Footer Hint */}
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 text-center border border-blue-200 dark:border-gray-700 animate-in slide-in-from-bottom-8 duration-700">
                    <p className="text-gray-700 dark:text-gray-200">
                        <span className="font-semibold">Need help choosing?</span> Each action plan will guide you step-by-step through accessing the benefit.
                    </p>
                </div>
            </div>
        </ScreenContainer>
    );
};