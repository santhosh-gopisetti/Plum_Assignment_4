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
        error,         // <-- Using global error state
        setError,      // <-- Using global error setter
        isLoading,     // <-- Using global loading state
        setIsLoading   // <-- Using global loading setter
    } = useFlow();

    const [copied, setCopied] = useState(false);
    const [completedSteps, setCompletedSteps] = useState(new Set());

    // --- EFFECT: Initial Fetch and Regeneration Logic ---
    useEffect(() => {
        const fetchActionPlan = async () => {
            if (!selectedBenefit) return;

            try {
                setError(null);
                setIsLoading(true); // START global loading
                
                // --- CORE LOGIC: Simulated AI 2 Generation ---
                const plan = await generateActionPlan(selectedBenefit.title);
                
                setActionPlan(plan);
                setCompletedSteps(new Set()); // Reset completion state on new plan
            } catch (err) {
                // Handle API error by setting global error state
                setError(err);
            } finally {
                setIsLoading(false); // END global loading
            }
        };

        // Fetch on initial render or when selectedBenefit changes (though it shouldn't here)
        fetchActionPlan();
    }, [selectedBenefit, setActionPlan, setError, setIsLoading]); 

    // --- HANDLERS ---
    const handleBack = () => {
        setCurrentScreen('benefits');
    };

    const handleStartOver = () => {
        // Clearing flow data ensures a clean start
        setActionPlan([]); 
        setCurrentScreen('input');
    };

    const handleCopyPlan = async () => {
        const planText = actionPlan.map((step, index) => `${index + 1}. ${step}`).join('\n');
        try {
            // Using modern clipboard API (suitable for most environments)
            await navigator.clipboard.writeText(planText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy (clipboard API error):', err);
            // Fallback for environments where clipboard API is restricted
            // (You might add document.execCommand('copy') here if needed)
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
        // Clears current plan visually and re-triggers the useEffect logic
        setActionPlan([]);
        
        // Manual trigger for the API call logic
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
        // This case is unlikely if the flow is followed, but handles deep linking errors
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900 animate-in fade-in">
                <Card className="p-12 text-center">
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">No benefit selected.</p>
                    <Button onClick={handleStartOver} variant="primary">
                        Start Over
                    </Button>
                </Card>
            </div>
        );
    }

    // --- RENDER ---
    return (
        <ScreenContainer className="py-12 px-6 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 transition-all transform hover:-translate-x-1 animate-in slide-in-from-left-4"
                    aria-label="Back to benefits"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Benefits</span>
                </button>

                <Card className="p-8 md:p-12 backdrop-blur-sm bg-opacity-95 animate-in slide-in-from-top-4 duration-700">
                    {/* Selected Benefit Header */}
                    <div className="mb-8">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-full">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                                {selectedBenefit.title}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-200 text-lg leading-relaxed">
                            {selectedBenefit.description}
                        </p>
                        {/* Coverage/Eligibility Details */}
                        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg space-y-2 text-sm border border-indigo-200 dark:border-indigo-800">
                            {selectedBenefit.coverage && (
                                <p>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Coverage:</span>{' '}
                                    <span className="text-gray-600 dark:text-gray-300">{selectedBenefit.coverage}</span>
                                </p>
                            )}
                            {selectedBenefit.eligibility && (
                                <p>
                                    <span className="font-semibold text-gray-700 dark:text-gray-300">Eligibility:</span>{' '}
                                    <span className="text-gray-600 dark:text-gray-300">{selectedBenefit.eligibility}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Plan Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            Your Personalized Action Plan
                        </h2>

                        {/* Loading/Error State */}
                        {error && (
                            <ErrorMessage
                                error={error}
                                // Retry handler uses the regenerate logic
                                onRetry={error.retryable ? handleRegenerate : undefined} 
                                onDismiss={handleBack}
                                className="mb-6"
                            />
                        )}

                        {isLoading && !error && (
                            <div className="flex flex-col items-center py-12 animate-in zoom-in duration-500">
                                {/* Custom Loader UI */}
                                <div className="relative mb-6">
                                    <div className="relative bg-gradient-to-br from-indigo-500 to-indigo-600 p-5 rounded-full shadow-2xl">
                                        <Loader2 className="w-10 h-10 text-white animate-spin" />
                                    </div>
                                </div>
                                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                                    Generating your personalized action plan...
                                </p>
                            </div>
                        )}

                        {/* Final Plan Display */}
                        {!isLoading && !error && actionPlan.length > 0 && (
                            <div className="space-y-6">
                                <div className="relative pl-8">
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" /> 
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
                                    <CheckCircle2 className="w-6 h-6 text-green-600 mr-2 animate-pulse" />
                                    <p className="text-green-600 font-semibold text-lg">Action plan ready! Click each step to mark as complete.</p>
                                </div>

                                {/* Action Buttons (Copy, Regenerate, Discover More) */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-in slide-in-from-bottom-8 duration-700">
                                    <Button onClick={handleCopyPlan} variant="secondary" size="lg" className="flex-1" icon={copied ? Check : Clipboard}>
                                        {copied ? 'Copied!' : 'Copy Plan'}
                                    </Button>
                                    <Button onClick={handleRegenerate} variant="secondary" size="lg" className="flex-1">
                                        Regenerate Plan
                                    </Button>
                                    <Button onClick={handleStartOver} variant="primary" size="lg" className="flex-1" icon={Sparkles}>
                                        Discover More Benefits
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Completion Banner */}
                {completedSteps.size === actionPlan.length && actionPlan.length > 0 && (
                    <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 border-2 border-green-300 dark:border-green-700 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-center gap-3">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                            <p className="text-green-900 dark:text-green-300 font-bold text-lg">
                                Congratulations! You've completed all steps. Your benefit should be accessible soon!
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Footer Hint */}
                <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 border border-blue-200 dark:border-gray-700 animate-in slide-in-from-bottom-9 duration-700">
                    <p className="text-gray-700 dark:text-gray-200 text-center">
                        <span className="font-semibold">Next steps:</span> Follow each step in order to successfully access your benefit. If you have questions, contact your HR department for assistance.
                    </p>
                </div>

            </div>
        </ScreenContainer>
    );
};