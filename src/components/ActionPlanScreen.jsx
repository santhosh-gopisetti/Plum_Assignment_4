import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { Loader2, CheckCircle2, ArrowLeft, Clipboard, Check, Sparkles } from 'lucide-react';
import { generateActionPlan } from '../services/api';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { TimelineStep } from './TimelineStep';
import { ScreenContainer } from './ui/ScreenContainer';
import { ErrorMessage } from './ui/ErrorMessage';

export const ActionPlanScreen = () => {
    // --- Destructuring Global Context State ---
    const { 
        selectedBenefit, 
        actionPlan, 
        setActionPlan, 
        setCurrentScreen, 
        error,         
        setError,      
        isLoading,     
        setIsLoading   
    } = useFlow();

    const [copied, setCopied] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(new Set());

    // --- EFFECT: Initial Fetch and Regeneration Logic ---
    useEffect(() => {
        const fetchActionPlan = async () => {
            if (!selectedBenefit) return;

            try {
                setError(null);
                setIsLoading(true); 
                
                const plan = await generateActionPlan(selectedBenefit.title);
                
                setActionPlan(plan);
                setCompletedSteps(new Set()); 
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false); 
            }
        };

        fetchActionPlan();
    }, [selectedBenefit, setActionPlan, setError, setIsLoading]); 

    // --- HANDLERS ---
    const handleBack = () => {
        setCurrentScreen('benefits');
    };

    const handleStartOver = () => {
        setActionPlan([]); 
        setCurrentScreen('input');
    };

    const handleCopyPlan = async () => {
        const planText = actionPlan.map((step, index) => `${index + 1}. ${step}`).join('\n');
        try {
            await navigator.clipboard.writeText(planText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy (clipboard API error):', err);
        }
    };

    const toggleStepComplete = (index) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(index)) {
            newCompleted.delete(index);
        } else {
            newCompleted.add(index);
        }
        setCompletedSteps(newCompleted);
    };

    const handleRegenerate = () => {
        setActionPlan([]);
        
        const regenerateLogic = async () => {
             if (!selectedBenefit) return;
             try {
                setError(null);
                setIsLoading(true);
                const plan = await generateActionPlan(selectedBenefit.title);
                setActionPlan(plan);
                setCompletedSteps(new Set()); 
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };
        regenerateLogic();
    };

    // --- INITIAL CHECK ---
    if (!selectedBenefit) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-100 dark:bg-gray-950 animate-in fade-in">
                <Card className="p-12 text-center bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">No benefit selected.</p>
                    <Button 
                        onClick={handleStartOver} 
                        variant="primary"
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-md text-white"
                    >
                        Start Over
                    </Button>
                </Card>
            </div>
        );
    }

    // --- RENDER ---
    return (
        // FIX: Default light mode background
        <ScreenContainer className="py-12 px-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6 transition-all transform hover:-translate-x-1 animate-in slide-in-from-left-4"
                    aria-label="Back to benefits"
                >
                    <ArrowLeft className="w-5 h-5 text-indigo-600 dark:text-teal-400" />
                    <span className="font-medium">Back to Benefits</span>
                </button>

                {/* Main Card: Clean, simple shadow and border */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 animate-in slide-in-from-top-4 duration-700">
                    {/* Selected Benefit Header */}
                    <div className="mb-8">
                        <div className="flex items-start gap-3 mb-4">
                            {/* Icon: Updated to Purple/Teal */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-indigo-600 to-teal-500 p-2 rounded-full">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            {/* FIX: Text is dark in light mode */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
                                {selectedBenefit.title}
                            </h1>
                        </div>
                        {/* FIX: Text is dark in light mode */}
                        <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                            {selectedBenefit.description}
                        </p>
                        {/* Coverage/Eligibility Details - Updated Background */}
                        <div className="mt-4 p-4 bg-indigo-50 dark:bg-teal-900/40 rounded-lg space-y-2 text-sm border border-indigo-300 dark:border-teal-500/30">
                            {selectedBenefit.coverage && (
                                <p>
                                    <span className="font-semibold text-gray-800 dark:text-teal-300">Coverage:</span>{' '}
                                    <span className="text-gray-700 dark:text-gray-300">{selectedBenefit.coverage}</span>
                                </p>
                            )}
                            {selectedBenefit.eligibility && (
                                <p>
                                    <span className="font-semibold text-gray-800 dark:text-indigo-300">Eligibility:</span>{' '}
                                    <span className="text-gray-700 dark:text-gray-300">{selectedBenefit.eligibility}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Plan Section */}
                    <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
                        {/* FIX: Text is dark in light mode */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                            Your Personalized Action Plan
                        </h2>

                        {/* Loading/Error State */}
                        {error && (
                            <ErrorMessage
                                error={error}
                                onRetry={error.retryable ? handleRegenerate : undefined} 
                                onDismiss={handleBack}
                                className="mb-6"
                            />
                        )}

                        {isLoading && !error && (
                            <div className="flex flex-col items-center py-12 animate-in zoom-in duration-500">
                                {/* Custom Loader UI: Updated to Purple/Teal */}
                                <div className="relative mb-6">
                                    <div className="relative bg-gradient-to-br from-indigo-600 to-teal-500 p-5 rounded-full shadow-2xl">
                                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                                    </div>
                                </div>
                                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                                    Generating your personalized action plan...
                                </p>
                            </div>
                        )}

                        {/* Final Plan Display */}
                        {!isLoading && !error && actionPlan.length > 0 && (
                            <div className="space-y-6">
                                <div className="relative pl-16"> {/* FIX: Increased padding for circles */}
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" /> 
                                    <div className="space-y-5">
                                        {actionPlan.map((step, index) => (
                                            <TimelineStep
                                                key={index}
                                                index={index}
                                                text={step}
                                                completed={completedSteps.has(index)}
                                                onToggle={() => toggleStepComplete(index)}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center pt-2 animate-in zoom-in duration-500 delay-300">
                                    {/* Check Icon: Updated Color */}
                                    <CheckCircle2 className="w-6 h-6 text-teal-600 dark:text-teal-400 mr-2 animate-pulse" />
                                    <p className="text-teal-600 dark:text-teal-400 font-semibold text-lg">Action plan ready! Click each step to mark as complete.</p>
                                </div>

                                {/* Action Buttons (Copy, Regenerate, Discover More) */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in slide-in-from-bottom-8 duration-700">
                                    {/* Secondary Buttons: Darker BG, Colored Text */}
                                    <Button onClick={handleCopyPlan} variant="secondary" size="lg" className="flex-1 bg-gray-200 hover:bg-gray-300 text-indigo-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-teal-400" icon={copied ? Check : Clipboard}>
                                        {copied ? 'Copied!' : 'Copy Plan'}
                                    </Button>
                                    <Button onClick={handleRegenerate} variant="secondary" size="lg" className="flex-1 bg-gray-200 hover:bg-gray-300 text-teal-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-indigo-400">
                                        Regenerate Plan
                                    </Button>
                                    {/* Primary Button: Indigo Accent */}
                                    <Button onClick={handleStartOver} variant="primary" size="lg" className="flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-md text-white" icon={Sparkles}>
                                        Discover More Benefits
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Completion Banner - Updated Background */}
                {completedSteps.size === actionPlan.length && actionPlan.length > 0 && (
                    <div className="mt-6 bg-teal-50 dark:bg-teal-900/30 rounded-xl p-6 border-2 border-teal-300 dark:border-teal-600/50 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                            <p className="text-teal-900 dark:text-teal-200 font-bold text-lg">
                                Congratulations! You've completed all steps. Your benefit should be accessible soon!
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Footer Hint - Updated Background */}
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 animate-in slide-in-from-bottom-9 duration-700">
                    <p className="text-gray-700 dark:text-gray-300 text-center">
                        <span className="font-semibold text-indigo-600 dark:text-teal-400">Next steps:</span> Follow each step in order to successfully access your benefit. If you have questions, contact your HR department for assistance.
                    </p>
                </div>

            </div>
        </ScreenContainer>
    );
};




















