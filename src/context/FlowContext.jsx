import React, { createContext, useContext, useState } from 'react';

const FlowContext = createContext(undefined);

export const FlowProvider = ({ children }) => {
  // Core states for the 4-screen flow
  const [currentScreen, setCurrentScreen] = useState('input');
  const [inputText, setInputText] = useState('');
  const [aiCategory, setAiCategory] = useState('');
  const [benefits, setBenefits] = useState([]);
  const [selectedBenefit, setSelectedBenefit] = useState(null);
  const [actionPlan, setActionPlan] = useState([]);
  
  // State for proper async handling and UI feedback
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null); // Added dedicated state for general errors

  const value = {
    // State values
    currentScreen,
    inputText,
    aiCategory,
    benefits,
    selectedBenefit,
    actionPlan,
    isLoading,
    error, // Export error state

    // State setters
    setCurrentScreen,
    setInputText,
    setAiCategory,
    setBenefits,
    setSelectedBenefit,
    setActionPlan,
    setIsLoading,
    setError, // Export error setter
  };

  return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
};

export const useFlow = () => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error('useFlow must be used within a FlowProvider');
  }
  return context;
};