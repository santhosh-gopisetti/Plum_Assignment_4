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
            // Using document.execCommand('copy') as navigator.clipboard.writeText() can fail in some environments
            const textArea = document.createElement("textarea");
            textArea.value = planText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy (fallback method error):', err);
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
                <Card className="p-16 text-center bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                    {/* Increased size from text-xl to text-2xl */}
                    <p className="text-2xl text-gray-700 dark:text-gray-300 mb-6">No benefit selected.</p>
                    <Button 
                        onClick={handleStartOver} 
                        variant="primary"
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-xl text-white"
                    >
                        Start Over
                    </Button>
                </Card>
            </div>
        );
    }

    // --- RENDER ---
    return (
        <ScreenContainer className="py-12 px-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-8 transition-all transform hover:-translate-x-1 animate-in slide-in-from-left-4"
                    aria-label="Back to benefits"
                >
                    {/* Increased font size to text-lg */}
                    <ArrowLeft className="w-6 h-6 text-indigo-600 dark:text-teal-400" />
                    <span className="font-semibold text-lg">Back to Benefits</span>
                </button>

                {/* Main Card: Increased padding p-12 instead of p-8 */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12 animate-in slide-in-from-top-4 duration-700">
                    {/* Selected Benefit Header */}
                    <div className="mb-10">
                        <div className="flex items-start gap-4 mb-4">
                            {/* Icon: Increased size */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-indigo-600 to-teal-500 p-3 rounded-full">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            {/* Increased title size from text-3xl/4xl to text-4xl/5xl */}
                            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-gray-100 leading-tight">
                                {selectedBenefit.title}
                            </h1>
                        </div>
                        {/* Increased description size from text-lg to text-xl */}
                        <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">
                            {selectedBenefit.description}
                        </p>
                        {/* Coverage/Eligibility Details - Increased font size from text-sm to text-base */}
                        <div className="mt-6 p-5 bg-indigo-50 dark:bg-teal-900/40 rounded-xl space-y-3 text-base border border-indigo-300 dark:border-teal-500/30">
                            {selectedBenefit.coverage && (
                                <p>
                                    <span className="font-bold text-gray-800 dark:text-teal-300">Coverage:</span>{' '}
                                    <span className="text-gray-700 dark:text-gray-300">{selectedBenefit.coverage}</span>
                                </p>
                            )}
                            {selectedBenefit.eligibility && (
                                <p>
                                    <span className="font-bold text-gray-800 dark:text-indigo-300">Eligibility:</span>{' '}
                                    <span className="text-gray-700 dark:text-gray-300">{selectedBenefit.eligibility}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Action Plan Section */}
                    <div className="border-t border-gray-300 dark:border-gray-700 pt-8">
                        {/* Increased section title size from text-2xl to text-3xl */}
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                            Your Personalized Action Plan
                        </h2>

                        {/* Loading/Error State */}
                        {error && (
                            <ErrorMessage
                                error={error}
                                onRetry={error.retryable ? handleRegenerate : undefined} 
                                onDismiss={handleBack}
                                className="mb-8"
                            />
                        )}

                        {isLoading && !error && (
                            <div className="flex flex-col items-center py-16 animate-in zoom-in duration-500">
                                {/* Custom Loader UI: Increased size */}
                                <div className="relative mb-6">
                                    <div className="relative bg-gradient-to-br from-indigo-600 to-teal-500 p-6 rounded-full shadow-2xl">
                                        <Loader2 className="w-12 h-12 text-white animate-spin" />
                                    </div>
                                </div>
                                {/* Increased loading text size from text-lg to text-xl */}
                                <p className="text-xl text-gray-700 dark:text-gray-300 font-medium">
                                    Generating your personalized action plan...
                                </p>
                            </div>
                        )}

                        {/* Final Plan Display */}
                        {!isLoading && !error && actionPlan.length > 0 && (
                            <div className="space-y-8">
                                <div className="relative pl-16"> {/* Timeline Container */}
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" /> 
                                    <div className="space-y-6">
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

                                <div className="flex items-center justify-center pt-4 animate-in zoom-in duration-500 delay-300">
                                    {/* Increased icon size */}
                                    <CheckCircle2 className="w-7 h-7 text-teal-600 dark:text-teal-400 mr-3 animate-pulse" />
                                    {/* Increased confirmation text size from text-lg to text-xl */}
                                    <p className="text-teal-600 dark:text-teal-400 font-semibold text-xl">Action plan ready! Click each step to mark as complete.</p>
                                </div>

                                {/* --- LAYOUT FIX: New Stacked Priority Button Layout --- */}
                                <div className="flex flex-col gap-4 pt-6 animate-in slide-in-from-bottom-8 duration-700">
                                    {/* PRIMARY CTA FIRST: FULL WIDTH */}
                                    <Button onClick={handleStartOver} variant="primary" size="xl" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-xl text-white" icon={Sparkles}>
                                        Discover More Benefits
                                    </Button>
                                    
                                    {/* SECONDARY ACTIONS: Grouped below, side-by-side (or stacked on mobile) */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Button onClick={handleCopyPlan} variant="secondary" size="lg" className="flex-1 bg-gray-200 hover:bg-gray-300 text-indigo-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-teal-400" icon={copied ? Check : Clipboard}>
                                            {copied ? 'Copied!' : 'Copy Plan'}
                                        </Button>
                                        <Button onClick={handleRegenerate} variant="secondary" size="lg" className="flex-1 bg-gray-200 hover:bg-gray-300 text-teal-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-indigo-400">
                                            Regenerate Plan
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Completion Banner - Increased icon and text size */}
                {completedSteps.size === actionPlan.length && actionPlan.length > 0 && (
                    <div className="mt-6 bg-teal-50 dark:bg-teal-900/30 rounded-xl p-6 border-2 border-teal-300 dark:border-teal-600/50 animate-in zoom-in duration-500">
                        <div className="flex items-center justify-center gap-4">
                            <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                            {/* Increased text size from text-lg to text-xl */}
                            <p className="text-teal-900 dark:text-teal-200 font-bold text-xl">
                                Congratulations! You've completed all steps. Your benefit should be accessible soon!
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Footer Hint - Increased text size */}
                <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-300 dark:border-gray-700 animate-in slide-in-from-bottom-9 duration-700">
                    <p className="text-gray-700 dark:text-gray-300 text-center text-lg">
                        <span className="font-semibold text-indigo-600 dark:text-teal-400">Next steps:</span> Follow each step in order to successfully access your benefit. If you have questions, contact your HR department for assistance.
                    </p>
                </div>

            </div>
        </ScreenContainer>
    );
};