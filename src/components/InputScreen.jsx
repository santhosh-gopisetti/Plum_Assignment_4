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
  const isValid = localInput.trim().length >= 10;

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_CHARS) {
      setLocalInput(value);
      setCharCount(value.length);
    }
  };

  const handleDiscoverBenefits = () => {
    if (isValid) {
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

  return (
    <ScreenContainer className="flex h-screen w-full relative bg-gray-50 dark:bg-[#0d0d1a] overflow-hidden transition-colors duration-500">
      {/* LEFT PANEL */}
      <div
        className="hidden lg:flex lg:w-7/12 items-center justify-center relative"
        style={{
          backgroundImage: 'url(/screenshots/h.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4e44ce]/50 to-[#6b63ff]/70 dark:from-[#1d174f]/80 dark:to-[#2f2a7a]/70 backdrop-blur-sm transition-all duration-700"></div>

        {/* Hero Text */}
        <div className="relative text-white p-12 text-center animate-in fade-in slide-in-from-left-10 duration-1000">
          <h1 className="text-6xl xl:text-7xl font-extrabold mb-5 opacity-95 tracking-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)]">
            Human Problems
            <br />
            Clear Solutions
          </h1>
          <p className="text-xl font-light opacity-90">
            Your personalized guide to benefits and coverage.
          </p>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-5/12 h-full overflow-y-auto p-8 md:p-12 bg-white dark:bg-[#151527] lg:shadow-2xl lg:shadow-indigo-900/20 flex flex-col justify-between z-10 transition-all duration-500">
        
        <div className="flex-grow">
          {/* Header */}
          <header className="mb-8 pt-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-indigo-600 dark:text-[#66d9ff]" />
                Health Benefit Discovery Assistant
              </h1>
            </div>

            <p className="mt-5 text-4xl font-extrabold text-gray-900 dark:text-[#f4f6ff] leading-tight">
              Describe Your Need
            </p>
            <p className="text-lg text-gray-700 dark:text-[#c6c8e8] mt-3">
              Our AI will analyze your description and find the perfect benefit.
            </p>
          </header>

          {/* Input Section */}
          <div className="mb-6">
            <label
              htmlFor="needs-input"
              className="block text-sm font-semibold text-indigo-600 dark:text-[#66d9ff] mb-3"
            >
              What do you need help with?
            </label>

            <div
              className={`relative rounded-2xl transition-all duration-200 ${
                isFocused ? 'shadow-lg shadow-indigo-300/40 dark:shadow-[#66d9ff]/20' : ''
              }`}
            >
              <textarea
                id="needs-input"
                value={localInput}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Describe your situation in detail..."
                className="w-full h-44 px-5 py-4 text-lg text-gray-900 dark:text-gray-100 border-2 border-gray-300 dark:border-[#2a2a4b] bg-gray-50 dark:bg-[#0d0d1a] rounded-2xl focus:border-indigo-600 focus:ring-4 focus:ring-indigo-300/40 dark:focus:ring-[#66d9ff]/30 focus:outline-none transition-all resize-none"
                aria-describedby="char-count input-hint"
              />
              <div
                id="char-count"
                className="absolute bottom-3 right-3 text-xs text-gray-500 dark:text-gray-400 select-none"
              >
                {charCount}/{MAX_CHARS}
              </div>
            </div>

            {!isValid && localInput.length > 0 && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <Info className="w-4 h-4" />
                Please provide at least 10 characters for better analysis
              </p>
            )}
          </div>

          {/* Button */}
          <Button
            onClick={handleDiscoverBenefits}
            disabled={!isValid}
            className={`w-full mb-8 bg-gradient-to-r from-[#4e44ce] to-[#6b63ff] hover:from-[#5a50f0] hover:to-[#7a73ff] dark:from-[#009fb3] dark:to-[#00c8d8] dark:hover:from-[#00bcd4] dark:hover:to-[#00d4e0] text-white shadow-lg shadow-indigo-500/25 dark:shadow-[#00c8d8]/30 transform transition-all duration-300 hover:scale-[1.01] active:scale-[0.995]`}
            icon={Sparkles}
          >
            Discover Personalized Benefits
          </Button>

          {/* Example Prompts */}
          <div className="pt-4 border-t border-gray-200 dark:border-[#2a2a4b] space-y-3">
            <p className="text-base font-semibold text-gray-700 dark:text-[#c6c8e8]">
              Or try a quick start:
            </p>

            <div className="grid gap-2">
              {EXAMPLE_PROMPTS.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="group text-left text-base text-indigo-700 dark:text-[#00c8d8] bg-indigo-50 dark:bg-[#1b1b33] hover:bg-indigo-100 dark:hover:bg-[#232347] px-5 py-3 rounded-xl transition-all border border-indigo-200 dark:border-[#00c8d8]/20 font-medium shadow-sm hover:shadow-md hover:translate-x-[1px]"
                >
                  <span className="group-hover:text-indigo-900 dark:group-hover:text-[#7af8ff] transition-colors">
                    “{example}”
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-10 pt-6 border-t border-gray-200 dark:border-[#2a2a4b]">
          <p className="text-xs text-gray-500 dark:text-[#9ba1c9] text-center">
      
          </p>
        </footer>
      </div>
    </ScreenContainer>
  );
};
