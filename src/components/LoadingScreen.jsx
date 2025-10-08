import React, { useEffect, useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { Loader2, Sparkles } from 'lucide-react';
import { analyzeBenefits } from '../services/api';
import { ErrorMessage } from './ui/ErrorMessage';
import { ScreenContainer } from './ui/ScreenContainer';

export const LoadingScreen = () => {
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

    useEffect(() => {
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
            } finally {
                setIsLoading(false); 
            }
        };

        classifyInput();

        return () => clearInterval(progressInterval);
    }, [inputText, setAiCategory, setBenefits, setCurrentScreen, setError, setIsLoading]); 
    
    return (
        // FIX: Background is now white
        <ScreenContainer className="flex items-center justify-center p-6 animate-in fade-in duration-500 bg-white dark:bg-slate-900 min-h-screen">
            {error && <ErrorMessage message={error.message || 'An unknown error occurred'} />}
            <div className="max-w-xl w-full p-8 md:p-12 text-center"> 
                
                {/* Animated Loader Block */}
                <div className="flex flex-col items-center">
                    <div className="relative mb-10 animate-in zoom-in duration-500">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-40 h-40 bg-sky-400 rounded-full animate-ping opacity-10"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-blue-500 rounded-full animate-pulse opacity-20"></div>
                        </div>
                        <div className="relative bg-gradient-to-br from-blue-700 to-sky-400 p-8 rounded-full shadow-2xl">
                            {/* Increased Loader Icon size from w-16 h-16 to w-20 h-20 */}
                            <Loader2 className="w-20 h-20 text-white animate-spin" />
                        </div>
                    </div>

                    {/* Increased text size from text-4xl to text-5xl (or text-4xl on smaller screens) */}
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-4 animate-in slide-in-from-top-4">
                        <Sparkles className="w-10 h-10 text-blue-700 dark:text-sky-400 animate-pulse" />
                        Analyzing Your Needs
                    </h2>

                    {/* Increased text size from text-lg to text-xl */}
                    <p className="text-xl text-gray-700 dark:text-sky-300 text-center mb-10 animate-in slide-in-from-top-5">
                        Classifying and matching benefits. This usually takes a moment...
                    </p>

                    <div className="w-full max-w-md mx-auto mb-8">
                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-sky-400 to-blue-700 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        {/* Increased text size from text-sm to text-base */}
                        <p className="text-base text-gray-500 dark:text-gray-400 text-center mt-3">{progress}% complete</p>
                    </div>

                    <div className="w-full max-w-md mx-auto space-y-4 text-left">
                        {/* Increased text size for status messages from text-gray-700 to text-lg */}
                        <div className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300 animate-in slide-in-from-left-2 duration-500">
                            <div className="w-3 h-3 bg-blue-600 dark:bg-sky-400 rounded-full"></div>
                            <span>Processing user request</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300 animate-in slide-in-from-left-3 duration-700">
                            <div className="w-3 h-3 bg-sky-500 dark:bg-blue-600 rounded-full"></div>
                            <span>Classifying benefit category (AI Model Check)</span>
                        </div>
                        <div className="flex items-center gap-3 text-lg text-gray-700 dark:text-gray-300 animate-in slide-in-from-left-4 duration-900">
                            <div className="w-3 h-3 bg-blue-600 dark:bg-sky-400 rounded-full"></div>
                            <span>Finding matching benefits (Mock Data Retrieval)</span>
                        </div>
                    </div>

                    <div className="mt-12 p-6 bg-gray-100 border border-gray-300 dark:bg-gray-800/70 dark:border-gray-700 rounded-xl w-full">
                        {/* Increased text size from text-xs to text-sm */}
                        <p className="text-sm font-semibold text-gray-500 mb-2">Your query:</p>
                        {/* Increased text size from text-sm to text-base */}
                        <p className="text-base text-gray-700 dark:text-gray-400 italic leading-relaxed">
                            "{inputText.substring(0, 150)}{inputText.length > 150 ? '...' : ''}"
                        </p>
                    </div>
                </div>
            </div>
        </ScreenContainer>
    );
};