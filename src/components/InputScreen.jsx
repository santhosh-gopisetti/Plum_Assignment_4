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
        // Ensured the default background is visible for Light Mode
        <ScreenContainer className="flex items-center justify-center p-6 animate-in fade-in duration-500 bg-gray-100 dark:bg-gray-950 min-h-screen">
            <div className="max-w-3xl w-full">
                {/* Main Glass Card: Using light translucent background */}
                <div className="bg-white/90 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-xl shadow-fuchsia-500/10 border border-gray-200 dark:border-fuchsia-400/30 p-8 md:p-12">
                    <div className="flex items-center justify-center mb-6 animate-in slide-in-from-top-4 duration-700">
                        {/* Icon: Fuchsia/Cyan Gradient (remains high contrast) */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-fuchsia-400 rounded-full blur-xl opacity-30 animate-pulse"></div>
                            <div className="relative bg-gradient-to-br from-fuchsia-600 to-cyan-500 p-4 rounded-full shadow-lg">
                                <FileText className="w-12 h-12 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* TEXT FIX: Switched default (light mode) color to deep gray (text-gray-900) */}
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4 animate-in slide-in-from-top-5 duration-700">
                        Benefits Discovery Assistant
                    </h1>

                    <p className="text-lg text-gray-700 dark:text-gray-300 text-center mb-8 animate-in slide-in-from-top-6 duration-700">
                        Describe your needs, and our AI will help you find the right benefits and guide you through the process.
                    </p>

                    <div className="mb-6 animate-in slide-in-from-bottom-4 duration-700">
                        {/* LABEL FIX: Switched default color to deep gray/fuchsia */}
                        <label htmlFor="needs-input" className="block text-sm font-semibold text-fuchsia-600 dark:text-cyan-400 mb-3">
                            What do you need help with?
                        </label>
                        <div className={`relative transition-all duration-200 ${isFocused ? 'transform scale-[1.01] shadow-xl shadow-cyan-400/20' : ''}`}>
                            {/* Textarea: Input Styling Fix */}
                            <textarea
                                id="needs-input"
                                value={localInput}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyPress}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                placeholder="Describe your situation in detail..."
                                // FIX: Default text is now dark (text-gray-900) and background is white/light
                                className="w-full h-40 px-4 py-3 text-gray-900 dark:text-gray-100 border-2 border-gray-400 dark:border-gray-700 bg-white/70 dark:bg-gray-900/50 rounded-xl focus:border-fuchsia-600 focus:outline-none focus:ring-4 focus:ring-fuchsia-300 transition-all resize-none"
                                aria-describedby="char-count input-hint"
                            />
                            <div className="absolute bottom-3 right-3 text-sm text-gray-500 dark:text-gray-400" id="char-count">
                                {charCount}/{MAX_CHARS}
                            </div>
                        </div>
                        {!isValid && localInput.length > 0 && (
                            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1 animate-in slide-in-from-top-2">
                                <Info className="w-4 h-4" />
                                Please provide at least 10 characters for better analysis
                            </p>
                        )}
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2" id="input-hint">
                            Tip: Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'}+Enter to submit
                        </p>
                    </div>

                    {/* Button: Primary Fuchsia/Neon */}
                    <Button
                        onClick={handleDiscoverBenefits}
                        disabled={!isValid}
                        variant="primary"
                        size="lg"
                        className="w-full mb-6 animate-in slide-in-from-bottom-5 duration-700 bg-fuchsia-600 hover:bg-fuchsia-500 shadow-lg shadow-fuchsia-500/40 text-white"
                        icon={Sparkles}
                    >
                        Discover Benefits
                    </Button>

                    {/* Example Prompts: Cyan/Fuchsia Accent */}
                    <div className="space-y-4 animate-in slide-in-from-bottom-6 duration-700">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Try these examples:</p>
                        <div className="grid gap-2">
                            {EXAMPLE_PROMPTS.map((example, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleExampleClick(example)}
                                    // FIX: Uses dark text color and light, accented background for light mode
                                    className="text-left text-sm text-fuchsia-600 hover:text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100 dark:text-cyan-400 dark:bg-cyan-900/40 dark:hover:bg-cyan-900/60 px-4 py-3 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-fuchsia-300 dark:border-cyan-500/20"
                                >
                                    "{example}"
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Hint: Glassmorphism Applied */}
                <div className="mt-6 p-4 bg-white/90 dark:bg-gray-800/20 backdrop-blur-lg rounded-xl border border-gray-400 dark:border-gray-700 shadow-md animate-in slide-in-from-bottom-7 duration-700">
                    <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                        <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">How it works:</span> Our AI analyzes your needs, identifies relevant benefits, and creates a personalized action plan to help you access them.
                    </p>
                </div>
            </div>
        </ScreenContainer>
    );
};