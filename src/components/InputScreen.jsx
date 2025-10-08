import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { FileText, Sparkles, Info, Zap } from 'lucide-react'; 
import { Button } from './ui/Button';
import { ScreenContainer } from './ui/ScreenContainer';
import { CheckCircle, Lock } from 'lucide-react'; // Added for Trust Bar icons

const EXAMPLE_PROMPTS = [
    
];

export const InputScreen = () => {
    const { setInputText, setCurrentScreen } = useFlow();
    const [localInput, setLocalInput] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const MAX_CHARS = 500;
    const MIN_CHARS = 10; 

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARS) {
            setLocalInput(value);
            setCharCount(value.length);
        }
    };

    const handleDiscoverBenefits = () => {
        if (localInput.trim().length >= MIN_CHARS) {
            setInputText(localInput);
            setCurrentScreen('loading');
        }
    };

    const handleExampleClick = (example) => {
        setLocalInput(example);
        setCharCount(example.length);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleDiscoverBenefits();
        }
    };

    const isValid = localInput.trim().length >= MIN_CHARS;

    return (
        // Full Screen Container - 50/50 split
        <ScreenContainer className="flex h-screen w-full bg-white dark:bg-slate-900 relative">
            
            {/* LEFT HALF: Input Form - w-1/2 (50%) */}
            <div className="w-1/2 flex items-center justify-center p-8 lg:p-16 animate-in fade-in duration-500 overflow-y-auto z-10">
                <div className="max-w-xl w-full">
                    
                    {/* Header/Branding Block */}
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                {/* Logo/Icon Block - Blue/Sky Gradient */}
                                <div className="absolute inset-[-10px] bg-sky-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
                                <div className="relative bg-gradient-to-br from-blue-700 to-sky-400 p-5 rounded-full shadow-2xl">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        {/* Title (Increased Size) */}
                        <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-3 dark:text-white">
                           Health Benefits Discovery Assistant
                        </h1>
                        {/* Tagline (Increased Size) */}
                        <p className="text-xl text-blue-600 dark:text-sky-400 animate-in slide-in-from-top-6 duration-700">
                           
                        </p>
                    </div>

                    {/* Example Prompts */}
                    <div className="flex flex-wrap gap-2 mb-4 justify-center">
                        {EXAMPLE_PROMPTS.map((example, index) => (
                            <button
                                key={index}
                                onClick={() => handleExampleClick(example)}
                                className="text-sm text-blue-700 dark:text-sky-300 hover:text-white bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-600 dark:hover:bg-blue-700 px-3 py-1.5 rounded-full transition-colors border border-blue-300 dark:border-blue-700 flex items-center gap-1 font-medium whitespace-nowrap"
                            >
                                <Zap className="w-3.5 h-3.5" />
                                {example.split(' ').slice(0, 3).join(' ')}...
                            </button>
                        ))}
                    </div>

                    {/* Main Input Area */}
                    <div className="p-8 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl bg-white dark:bg-gray-800">
                        {/* Input Label (Increased Size) */}
                        <label htmlFor="needs-input" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                            What do you need help with?
                        </label>
                        <div className={`relative transition-all duration-300 ${isFocused ? 'shadow-blue-500/30 ring-4 ring-blue-500/20 rounded-xl' : ''}`}>
                            <textarea
                                id="needs-input"
                                value={localInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Example: I am suffering from severe dental problem."
                                className="w-full h-44 px-4 py-3 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-xl focus:border-blue-700 focus:outline-none transition-all resize-none placeholder-gray-500 dark:placeholder-gray-400"
                                aria-describedby="char-count input-hint"
                            />
                            <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400" id="char-count">
                                {charCount}/{MAX_CHARS}
                            </div>
                        </div>
                        {!isValid && localInput.length > 0 && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1 animate-in slide-in-from-top-2">
                                <Info className="w-4 h-4" />
                                Please provide at least {MIN_CHARS} characters for better analysis.
                            </p>
                        )}
                    </div>
                    
                    {/* Action Block */}
                    <div className="mt-6">
                        <Button
                            onClick={handleDiscoverBenefits}
                            disabled={!isValid}
                            variant="primary"
                            size="lg"
                            // CTA (Increased Size) - Blue/Sky Gradient
                            className="w-full h-16 text-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 shadow-2xl shadow-blue-500/50 text-white transition-all duration-300"
                            icon={Sparkles}
                        >
                            Analyze My Benefits Instantly
                        </Button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center" id="input-hint">
                          
                        </p>
                    </div>
                    
                    {/* Trust Bar (Crucial for a health app) */}
                    <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-around items-center text-xs font-medium text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              
                            </span>
                            <span className="flex items-center gap-1">
                                
                            </span>
                            <span className="flex items-center gap-1">
                
                            </span>
                        </div>
                    </div>

                    {/* How it works: Footer Hint */}
                    <div className="mt-10 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                            <span className="font-bold text-blue-700 dark:text-sky-400">How it works:</span> Our AI analyzes your needs, identifies relevant benefits, and creates a personalized action plan to help you access them.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT HALF: Image and Branding - w-1/2 (50%) */}
            <div 
                className="w-1/2 relative bg-cover bg-center animate-in fade-in duration-1000 hidden md:block"
                style={{ 
                    backgroundImage: "url('/h.jpg')", 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Gradient Overlay for Text Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-end pb-20 p-8">
                    <h2 className="text-4xl lg:text-5xl font-extrabold text-white text-center leading-tight drop-shadow-lg mb-4">
                        Health Benefits Discovery Assistant
                    </h2>
                    <p className="text-lg text-sky-300 text-center drop-shadow-md">
                        AI-Powered Navigation for Your Employee Benefits.
                    </p>
                </div>
                <div className="absolute top-4 right-4 text-white p-2 rounded-lg backdrop-blur-sm bg-black/30 text-sm">Dark Mode</div>
            </div>
        </ScreenContainer>
    );
};