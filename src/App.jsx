import React, { useEffect, useState } from 'react';
import { FlowProvider, useFlow } from './context/FlowContext';
import { InputScreen } from './components/InputScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { BenefitsScreen } from './components/BenefitsScreen';
import { ActionPlanScreen } from './components/ActionPlanScreen';

// Component to handle navigation logic
const AppContent = () => {
    const { currentScreen, error, setCurrentScreen, setError, setInputText } = useFlow();

    // 1. Handle Global Error State
    if (error) {
        const handleStartOver = () => {
            setError(null);
            setInputText('');
            setCurrentScreen('input');
        };

        return (
            <div className="flex items-center justify-center min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 border border-red-400 text-red-700 dark:text-red-300 p-8 rounded-xl shadow-2xl text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">
                        <svg className="w-8 h-8 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.398 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Request Failed
                    </h2>
                    <p className="mb-6 text-gray-700 dark:text-gray-300">
                        We encountered an issue during processing. Details: **{error.message || "Unknown API Error"}**
                    </p>
                    <button
                        onClick={handleStartOver}
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        );
    }

    // 2. Handle Normal Flow
    switch (currentScreen) {
        case 'input':
            return <InputScreen />;
        case 'loading':
            return <LoadingScreen />;
        case 'benefits':
            return <BenefitsScreen />;
        case 'action-plan':
            return <ActionPlanScreen />;
        default:
            return <InputScreen />; // Default safe return
    }
};

function App() {
    // Initial state check: prioritize localStorage theme, fall back to system preference
    const [isDark, setIsDark] = useState(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            return storedTheme === 'dark';
        }
        return document.documentElement.classList.contains('dark');
    });

    // Effect to apply theme class and persist to localStorage
    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    return (
        <FlowProvider>
            {/* Dark Mode Toggle Button (Bonus Work) */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={() => setIsDark(d => !d)}
                    className="px-4 h-10 rounded-full text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition duration-150"
                    aria-label="Toggle dark mode"
                >
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
            </div>
            
            {/* Main Content Router */}
            <AppContent />
        </FlowProvider>
    );
}

export default App;