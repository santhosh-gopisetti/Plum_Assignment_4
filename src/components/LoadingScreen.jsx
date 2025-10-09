import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { Loader2, Sparkles, CheckCircle, Search, Layers } from 'lucide-react';
import { analyzeBenefits } from '../services/api';
import { ErrorMessage } from './ui/ErrorMessage';
import { ScreenContainer } from './ui/ScreenContainer';

// --- UPDATED TEXT FOR EMPATHETIC FLOW ---
const PROCESS_STEPS = [
    { id: 1, label: 'Understanding Request', icon: CheckCircle },
    { id: 2, label: 'Searching Library', icon: Search },
    { id: 3, label: 'Filtering Data', icon: Layers },
    { id: 4, label: 'Presenting Benefits', icon: Sparkles },
];

export const LoadingScreen = () => {
    const { 
        inputText, 
        setBenefits, 
        setAiCategory, 
        setCurrentScreen, 
        error, 
        setError, 
        setIsLoading,
        aiCategory // <-- Destructure the state here to use it later if needed
    } = useFlow();

    // Use a step index to control the visual flow
    const [currentStepIndex, setCurrentStepIndex] = useState(0); 
    const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);
    
    // State to hold the interval ID for cleanup
    const [intervalId, setIntervalId] = useState(null);

    // --- EFFECT: API Call and Step Progression ---
    useEffect(() => {
        // --- 1. Start Visual Progression ---
        const interval = setInterval(() => {
            setCurrentStepIndex(prev => {
                // Stop the local animation once it hits the second-to-last step (Filtering Data)
                return prev < PROCESS_STEPS.length - 2 ? prev + 1 : prev;
            });
        }, 500);
        setIntervalId(interval);


        const classifyInput = async () => {
            try {
                setError(null);
                setIsLoading(true);
                
                // --- 2. CORE LOGIC: Simulated API Call ---
                const data = await analyzeBenefits(inputText); 
                
                // --- 3. Finalize Visuals & Navigate ---
                clearInterval(interval); // Stop the progressing animation
                setCurrentStepIndex(PROCESS_STEPS.length - 1); // Set visual to the final step
                setIsAnalysisComplete(true);
                
                // Wait for the final progress animation to display before navigating
                setTimeout(() => {
                    setAiCategory(data.category);
                    setBenefits(data.benefits);
                    setCurrentScreen('benefits');
                    setIsLoading(false); 
                }, 800); 

            } catch (err) {
                clearInterval(interval);
                setError(err);
                setIsLoading(false); 
            }
        };

        classifyInput();

        // Cleanup: vital to prevent memory leaks!
        return () => clearInterval(interval);
    }, [inputText, setAiCategory, setBenefits, setCurrentScreen, setError, setIsLoading]); 
    
    
    // --- RENDER LOGIC ---

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
                            Processing Request...
                        </div>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                            {isAnalysisComplete ? 'Analysis Complete!' : 'Initiating AI Model Check'}
                        </h2>
                        
                        <p className="text-lg text-teal-600 dark:text-teal-400 font-medium">
                            {isAnalysisComplete ? 'Results are ready. Redirecting...' : 'Matching your needs to available coverage now.'}
                        </p>
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
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 shadow-md ${isActive 
                                            ? 'bg-indigo-600 dark:bg-teal-500 shadow-indigo-400/50' 
                                            : 'bg-gray-300 dark:bg-gray-700'
                                        }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'} ${index === 2 && !isAnalysisComplete ? 'animate-spin' : ''}`} />
                                    </div>
                                    <p className={`mt-3 text-xs text-center font-medium w-20 transition-colors duration-500 ${isActive ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {step.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    
                    {/* 4. TYPOGRAPHIC REVEAL: Result Confirmation */}
                    <div className={`p-4 mt-8 text-center border-t border-gray-200 dark:border-gray-700 transition-opacity duration-1000 ${isAnalysisComplete ? 'opacity-100 animate-in fade-in' : 'opacity-0'}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            Found Benefits
                        </h3>
                        {/* Final, large text confirmation */}
                        <p className="text-3xl font-extrabold text-indigo-600 dark:text-teal-400 mt-2 tracking-tight">
                            
                        </p>
                    </div>

                </div>
            </div>
        </ScreenContainer>
    );
};