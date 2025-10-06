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
        error,         // <-- Using global error state
        setError,      // <-- Using global error setter
        setIsLoading   // <-- Using global loading setter (important for button/input control)
    } = useFlow();

    const [progress, setProgress] = useState(0);

    // --- EFFECT: API Call and Progress Bar Logic ---
    useEffect(() => {
        // Start the fake progress bar animation
        const progressInterval = setInterval(() => {
            // Stops at 90% to sync up with the actual API completion
            setProgress(prev => (prev >= 90 ? 90 : prev + 10));
        }, 200);

        const classifyInput = async () => {
            try {
                setError(null);
                setIsLoading(true); // Indicate that a process is running
                
                // --- CORE LOGIC: Simulated AI Classification ---
                const data = await analyzeBenefits(inputText); 

                setProgress(100);
                
                // Small final delay to let the user register the 100% completion
                setTimeout(() => {
                    setAiCategory(data.category);
                    setBenefits(data.benefits);
                    setCurrentScreen('benefits');
                    setIsLoading(false); // Clear loading state on success
                }, 300);

            } catch (err) {
                // Handle API error by setting global error state
                setError(err);
                setIsLoading(false); // Clear loading state on failure
                // We do NOT transition screen; the AppContent router handles the error screen display.
            }
        };

        classifyInput();

        // Cleanup: vital to prevent memory leaks!
        return () => clearInterval(progressInterval);
    }, [inputText, setAiCategory, setBenefits, setCurrentScreen, setError, setIsLoading]); 
    // Dependency array is complete

    // --- HANDLERS: Flow Control ---
    const handleRetry = () => {
        // Full page reload for a clean retry (best for simulating full process restart)
        window.location.reload(); 
    };

    const handleBackToInput = () => {
        // Simple state transition back to Screen 1
        setCurrentScreen('input'); 
        setError(null);
    };

    // --- RENDER LOGIC ---

    // The global error check is handled in App.jsx now, so this local check is removed.
    // However, if you prefer to keep a local error message for this screen:
    /*
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-6">
                 ... error markup here ...
            </div>
        );
    }
    */
   
    // If the error is handled in App.jsx, the component never reaches this return when an error exists.
    
    return (
        <ScreenContainer className="flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 backdrop-blur-sm bg-opacity-95">
                <div className="flex flex-col items-center">
                    <div className="relative mb-8 animate-in zoom-in duration-500">
                        {/* Custom Animated Loader UI */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 bg-indigo-100 rounded-full animate-ping opacity-20"></div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-28 h-28 bg-indigo-200 rounded-full animate-pulse opacity-30"></div>
                        </div>
                        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-700 p-6 rounded-full shadow-2xl">
                            <Loader2 className="w-12 h-12 text-white animate-spin" />
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 animate-in slide-in-from-top-4">
                        <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
                        Analyzing Your Needs
                    </h2>

                    <p className="text-lg text-gray-600 dark:text-gray-100 text-center mb-6 animate-in slide-in-from-top-5">
                        Analyzing your request and classifying your category...
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full max-w-md mb-8">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-700 transition-all duration-300 ease-out"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 text-center mt-2">{progress}% complete</p>
                    </div>

                    {/* Contextual Steps */}
                    <div className="w-full max-w-md space-y-4 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 animate-in slide-in-from-left-2 duration-500">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                            <span>Processing your request</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 animate-in slide-in-from-left-3 duration-700">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                            <span>Classifying benefit category</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200 animate-in slide-in-from-left-4 duration-900">
                            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                            <span>Finding matching benefits</span>
                        </div>
                    </div>

                    {/* Input Display */}
                    <div className="mt-8 p-4 bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg w-full border border-gray-200 animate-in slide-in-from-bottom-5">
                        <p className="text-sm text-gray-600 dark:text-gray-200 italic leading-relaxed">
                            "{inputText.substring(0, 150)}{inputText.length > 150 ? '...' : ''}"
                        </p>
                    </div>
                </div>
            </div>
        </ScreenContainer>
    );
};