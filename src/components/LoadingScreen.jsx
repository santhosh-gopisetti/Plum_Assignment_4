import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { Loader2, Sparkles, CheckCircle, Search, Layers } from 'lucide-react'; // Added icons for the steps
import { analyzeBenefits } from '../services/api';
import { ErrorMessage } from './ui/ErrorMessage';
import { ScreenContainer } from './ui/ScreenContainer';

// --- UPDATED TEXT FOR EMPATHETIC FLOW ---
const PROCESS_STEPS = [
    { id: 1, label: 'Understanding Your Request', icon: CheckCircle },
    { id: 2, label: 'Searching the Benefits Library', icon: Search },
    { id: 3, label: 'Filtering', icon: Layers },
    { id: 4, label: 'Presenting Benefits', icon: Sparkles },
];
// --- END UPDATED TEXT ---

export const LoadingScreen = () => {
    // --- USING GLOBAL CONTEXT STATE ---
    // --- USING GLOBAL CONTEXT STATE ---
    const { 
        inputText, 
        setBenefits, 
        setAiCategory, 
        setCurrentScreen, 
        error, 
        setError, 
        setIsLoading 
    } = useFlow();

    // Use a step index to control the visual flow
    const [currentStepIndex, setCurrentStepIndex] = useState(0); 
    const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

    // --- EFFECT: API Call and Step Progression ---
    useEffect(() => {
        // Increment the step indicator every 500ms for a visual effect
        const stepInterval = setInterval(() => {
            setCurrentStepIndex(prev => {
                // Stop the local animation once it hits the second-to-last step (Filtering Jargon)
                return prev < PROCESS_STEPS.length - 2 ? prev + 1 : prev;
            });
        }, 500);

        const classifyInput = async () => {
            try {
                setError(null);
                setIsLoading(true);
                
                // Simulate API Call
                const data = await analyzeBenefits(inputText); 

                // Stop local animation and jump to the final state
                clearInterval(stepInterval);
                setCurrentStepIndex(PROCESS_STEPS.length - 1); 
                setIsAnalysisComplete(true);
                
                // Wait for the final progress animation to display before navigating
                setTimeout(() => {
                    setAiCategory(data.category);
                    setBenefits(data.benefits);
                    setCurrentScreen('benefits');
                    setIsLoading(false); 
                }, 800); 

            } catch (err) {
                clearInterval(stepInterval);
                setError(err);
                setIsLoading(false); 
            }
        };

        classifyInput();

        // Cleanup: vital to prevent memory leaks!
        return () => clearInterval(stepInterval);
    }, [inputText, setAiCategory, setBenefits, setCurrentScreen, setError, setIsLoading]); 
    
    // --- RENDER LOGIC ---
    const aiCategoryText = isAnalysisComplete && !error ? 'Results Ready: ' + (setAiCategory.category) : '';
    
    if (error) {
        // Assuming ErrorMessage is functional
        return <ErrorMessage message={error.message} onRetry={() => setCurrentScreen('input')} />;
    }

    return (
        <ScreenContainer className="flex items-center justify-center p-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-2xl w-full">
                
                {/* 1. QUESTION ANCHOR: Confirming what the AI is working on */}
                <div className="mb-8 p-4 bg-white border-2 border-indigo-200 dark:bg-gray-700 dark:border-indigo-900 rounded-xl shadow-lg animate-in slide-in-from-top-6 duration-700">
                    <p className="text-sm font-semibold text-indigo-600 dark:text-teal-400 mb-1">Your Query:</p>
                    <p className="text-base text-gray-800 dark:text-gray-200 italic leading-relaxed">
                        "{inputText.substring(0, 120)}{inputText.length > 120 ? '...' : ''}"
                    </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
                    
                    {/* 2. CREATIVE HEADING: Human Translator Text */}
                    <div className="text-center mb-10">
                        <div className="px-3 py-1 mb-4 inline-block bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-sm font-semibold rounded-full">
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">

                        </h2>
                        {/* Dynamic status update */}
                        <p className="text-lg text-teal-600 dark:text-teal-400 font-medium">
                            {isAnalysisComplete ? 'Analysis Complete. Preparing Options...' : 'We\'re matching your needs to your coverage benefits now.'}
                        </p>

                        {/* Progress Bar: FIX: Gradient is Purple/Teal */}
                        <div className="w-full max-w-md mb-8">
                            <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">{progress}% complete</p>
                        </div>

                        {/* Contextual Steps: FIX: Default is dark for contrast, accents use Purple/Teal */}
                        <div className="w-full max-w-md space-y-4 animate-in slide-in-from-bottom-4">
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 animate-in slide-in-from-left-2 duration-500">
                                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-400 rounded-full animate-pulse"></div>
                                <span>Processing your request</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 animate-in slide-in-from-left-3 duration-700">
                                <div className="w-2 h-2 bg-teal-500 dark:bg-indigo-600 rounded-full animate-pulse"></div>
                                <span>Classifying benefit category</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 animate-in slide-in-from-left-4 duration-900">
                                <div className="w-2 h-2 bg-indigo-600 dark:bg-teal-400 rounded-full animate-pulse"></div>
                                <span>Finding matching benefits</span>
                            </div>
                        </div>

                        {/* Input Display: FIX: Default background is light, dark text */}
                        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 dark:bg-white/5 dark:border-gray-700 rounded-lg w-full animate-in slide-in-from-bottom-5">
                            <p className="text-sm text-gray-700 dark:text-gray-400 italic leading-relaxed">
                                "{inputText.substring(0, 150)}{inputText.length > 150 ? '...' : ''}"
                            </p>
                        </div>
                    </div>

                    {/* 3. CREATIVE: ANIMATED PROCESS FLOW (Visual Timeline) */}
                    <div className="flex justify-between items-center relative w-full mb-12">
                        {/* Connecting Line (Gradient) */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2">
                            <div 
                                className="h-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all duration-500 ease-in-out" 
                                style={{ width: `${(currentStepIndex / (PROCESS_STEPS.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        {/* Step Icons */}
                        {PROCESS_STEPS.map((step, index) => {
                            const isActive = index <= currentStepIndex;
                            const Icon = step.icon;
                            
                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 
                                        ${isActive 
                                            ? 'bg-indigo-600 dark:bg-teal-500 shadow-lg shadow-indigo-400/50' 
                                            : 'bg-gray-300 dark:bg-gray-700'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'} ${index === 2 ? 'animate-spin' : ''}`} />
                                    </div>
                                    <p className={`mt-3 text-xs text-center font-medium w-20 transition-colors duration-500 ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {step.label.split(' ')[0]}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* 4. TYPOGRAPHIC REVEAL: Result Confirmation */}
                    <div className={`p-4 mt-8 text-center border-t border-gray-200 dark:border-gray-700 transition-opacity duration-1000 ${isAnalysisComplete ? 'opacity-100 animate-in fade-in' : 'opacity-0'}`}>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        </h3>
                        {/* Final, large text confirmation */}
                        <p className="text-4xl font-extrabold text-indigo-600 dark:text-teal-400 mt-2 tracking-tight">
                             
                        </p>
                    </div>

                </div>
            </div>
        </ScreenContainer>
    );
};