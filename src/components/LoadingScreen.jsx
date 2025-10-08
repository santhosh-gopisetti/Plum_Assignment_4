import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { Loader2, Sparkles } from 'lucide-react';
import { analyzeBenefits } from '../services/api';
import { ErrorMessage } from './ui/ErrorMessage';
import { ScreenContainer } from './ui/ScreenContainer';

export const LoadingScreen = () => {
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

    const [progress, setProgress] = useState(0);

    // --- EFFECT: API Call and Progress Bar Logic ---
    useEffect(() => {
        // Start the fake progress bar animation
        const progressInterval = setInterval(() => {
            setProgress(prev => (prev >= 90 ? 90 : prev + 10));
        }, 200);

        const classifyInput = async () => {
            try {
                setError(null);
                setIsLoading(true); 
                
                const data = await analyzeBenefits(inputText); 

                setProgress(100);
                
                setTimeout(() => {
                    setAiCategory(data.category);
                    setBenefits(data.benefits);
                    setCurrentScreen('benefits');
                    setIsLoading(false); 
                }, 300);

            } catch (err) {
                setError(err);
                setIsLoading(false); 
            }
        };

        classifyInput();

        // Cleanup: vital to prevent memory leaks!
        return () => clearInterval(progressInterval);
    }, [inputText, setAiCategory, setBenefits, setCurrentScreen, setError, setIsLoading]); 
    
    
    return (
        <ScreenContainer className="flex items-center justify-center p-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <div className="max-w-2xl w-full">
                {/* Main Card: Clean White in Light Mode */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-12">
                    <div className="flex flex-col items-center">
                        <div className="relative mb-8 animate-in zoom-in duration-500">
                            {/* Custom Animated Loader UI: Updated to Purple/Teal */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 bg-teal-400 rounded-full animate-ping opacity-20"></div>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-28 h-28 bg-indigo-400 rounded-full animate-pulse opacity-30"></div>
                            </div>
                            <div className="relative bg-gradient-to-br from-indigo-600 to-teal-500 p-6 rounded-full shadow-2xl">
                                <Loader2 className="w-12 h-12 text-white animate-spin" />
                            </div>
                        </div>

                        {/* Heading Text: FIX: Default is dark for contrast */}
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2 animate-in slide-in-from-top-4">
                            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-teal-400 animate-pulse" />
                            Analyzing Your Needs
                        </h2>

                        {/* Body Text: FIX: Default is dark gray for contrast */}
                        <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-6 animate-in slide-in-from-top-5">
                            Analyzing your request and classifying your category...
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
                </div>
            </div>
        </ScreenContainer>
    );
};