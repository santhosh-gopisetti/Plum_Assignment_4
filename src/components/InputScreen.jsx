import React, { useState } from 'react';
import { useFlow } from '../context/FlowContext';
import { FileText, Sparkles, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { ScreenContainer } from './ui/ScreenContainer';

const EXAMPLE_PROMPTS = [
    "I have a toothache and need dental care",
    "I've been feeling stressed and anxious lately",
    "My vision is blurry and I need glasses"
];

export const InputScreen = () => {
    const { setInputText, setCurrentScreen } = useFlow();
    const [localInput, setLocalInput] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [isFocused, setIsFocused] = useState(false);
    const MAX_CHARS = 500;

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= MAX_CHARS) {
            setLocalInput(value);
            setCharCount(value.length);
        }
    };

    const handleDiscoverBenefits = () => {
        if (localInput.trim()) {
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

    const isValid = localInput.trim().length >= 10;

    return (
        <ScreenContainer 
            className="flex items-center justify-center p-6 animate-in fade-in duration-500 bg-gray-50 dark:bg-gray-950 min-h-screen relative"
            // Set the background image URL and styling for relevance
            style={{
                backgroundImage: 'url(https://source.unsplash.com/random/1600x900/?health,abstract,data)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm"></div>
            
            <div className="max-w-3xl w-full z-10">
                {/* Main Card: Clean, simple shadow and border */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
                    <div className="flex items-center justify-center mb-6 animate-in slide-in-from-top-4 duration-700">
                        {/* Icon: Purple/Teal Gradient */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-indigo-700 to-teal-500 p-4 rounded-full shadow-lg">
                                <FileText className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Text: High Contrast */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4 animate-in slide-in-from-top-5 duration-700">
                        Benefits Discovery Assistant
                    </h1>

                    <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-8 animate-in slide-in-from-top-6 duration-700">
                        Describe your needs, and our AI will help you find the right benefits and guide you through the process.
                    </p>

                    <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
                        <label htmlFor="needs-input" className="block text-sm font-semibold text-indigo-600 dark:text-teal-400 mb-3">
                            What do you need help with?
                        </label>
                        <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-[1.01] shadow-md shadow-indigo-300/40' : ''}`}>
                            {/* Textarea: Clean Focus Ring */}
                            <textarea
                                id="needs-input"
                                value={localInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Describe your situation in detail..."
                                className="w-full h-40 px-4 py-3 text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-300/60 transition-all resize-none"
                                aria-describedby="char-count input-hint"
                            />
                            <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400" id="char-count">
                                {charCount}/{MAX_CHARS}
                            </div>
                        </div>
                        {!isValid && localInput.length > 0 && (
                            <p className="text-sm text-red-600 mt-2 flex items-center gap-1 animate-in slide-in-from-top-2">
                                <Info className="w-4 h-4" />
                                Please provide at least 10 characters for better analysis
                            </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2" id="input-hint">
                            Tip: Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
                        </p>
                    </div>

                    {/* Button: Primary Indigo */}
                    <Button
                        onClick={handleDiscoverBenefits}
                        disabled={!isValid}
                        variant="primary"
                        size="lg"
                        className="w-full mb-6 animate-in slide-in-from-bottom-5 duration-700 bg-indigo-600 hover:bg-indigo-700 shadow-md text-white"
                        icon={Sparkles}
                    >
                        Discover Benefits
                    </Button>

                    {/* Example Prompts: Teal/Indigo Accent */}
                    <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Try these examples:</p>
                        <div className="grid gap-2">
                            {EXAMPLE_PROMPTS.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleExampleClick(example)}
                                    className="text-left text-sm text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-teal-400 dark:bg-teal-900/40 dark:hover:bg-teal-900/60 px-4 py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-indigo-200 dark:border-teal-500/20"
                                >
                                    "{example}"
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Hint: Clean, simple background */}
                <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md animate-in slide-in-from-bottom-7 duration-700 border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                        <span className="font-semibold text-indigo-600 dark:text-teal-400">How it works:</span> Our AI analyzes your needs, identifies relevant benefits, and creates a personalized action plan to help you access them.
                    </p>
                </div>
            </div>
        </ScreenContainer>
    );
};