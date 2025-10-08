const API_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 30000,
};

// Custom error class for API failures
class APIError extends Error {
  constructor(message, code, retryable = false) {
    super(message);
    this.name = 'APIError';
    this.code = code;
    this.retryable = retryable;
  }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Executes a fetch request with retries, exponential backoff, and a timeout.
 */
async function fetchWithRetry(url, options, retries = API_CONFIG.maxRetries) {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          response.status >= 500 || response.status === 429 // Retryable if 5xx or 429
        );
      }

      return await response.json();
    } catch (error) {
      lastError = error;

      if (error.name === 'AbortError') {
        lastError = new APIError('Request timeout - please try again', 'TIMEOUT', true);
      }

      const shouldRetry =
        attempt < retries &&
        (lastError.retryable || lastError.name === 'AbortError' || lastError.message.includes('fetch')); // Catch network errors

      if (shouldRetry) {
        const delay = API_CONFIG.retryDelay * Math.pow(2, attempt);
        await sleep(delay);
        continue;
      }

      break;
    }
  }

  throw lastError;
}

// --- MOCK DATA ---
const BENEFITS_DATA = {
  'Dental': [
    {
      title: 'Comprehensive Dental Coverage',
      description: 'Full dental insurance covering preventive care, fillings, root canals, and crowns with 80% coverage after deductible.',
      coverage: '80% after deductible',
      eligibility: 'All full-time employees',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RTQ5OUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMEJFNkYwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIGZvbnQtZmFtaWx5PSJTYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QklOPC90ZXh0Pjwvc3ZnPg=='
    },
    {
      title: 'Orthodontic Benefits',
      description: 'Coverage for braces and aligners up to $2,000 lifetime maximum for adults and children.',
      coverage: 'Up to $2,000 lifetime',
      eligibility: 'Employees and dependents',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RTQ5OUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMEJFNkYwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIGZvbnQtZmFtaWx5PSJTYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QklOPC90ZXh0Pjwvc3ZnPg=='
    }
  ],
  'Mental Health': [
    {
      title: 'Employee Assistance Program (EAP)',
      description: 'Free confidential counseling sessions with licensed therapists, available 24/7 for you and your family members.',
      coverage: '8 free sessions per year',
      eligibility: 'All employees and family',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RTQ5OUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMEJFNkYwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIGZvbnQtZmFtaWx5PSJTYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QklOPC90ZXh0Pjwvc3ZnPg=='
    },
    {
      title: 'Mental Health Therapy Coverage',
      description: 'Coverage for ongoing therapy sessions with in-network providers at $20 copay per visit.',
      coverage: '$20 copay per session',
      eligibility: 'All enrolled members',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RTQ5OUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMEJFNkYwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIGZvbnQtZmFtaWx5PSJTYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QklOPC90ZXh0Pjwvc3ZnPg=='
    }
  ],
  'Vision': [
    {
      title: 'Annual Eye Exam',
      description: 'Comprehensive eye examination once per year with no copay through our network of eye care professionals.',
      coverage: 'No copay',
      eligibility: 'All enrolled members',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5ub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PGRlZnM+PGxpbmVhciBHcmFkaWVudCBpZD0iYSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzVFNjZDRCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzU2Q0NGMiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IlNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5CSU48L3RleHQ+PC9zdmc+'
    },
    {
      title: 'Prescription Eyewear',
      description: 'Allowance of $200 annually toward prescription glasses or contact lenses at participating retailers.',
      coverage: '$200 annual allowance',
      eligibility: 'All enrolled members',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RTQ5OUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMEJFNkYwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIGZvbnQtZmFtaWx5PSJTYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QklOPC90ZXh0Pjwvc3ZnPg=='
    }
  ],
  'General': [
    {
      title: 'Preventive Care Coverage',
      description: 'Annual physical exams, immunizations, and health screenings at no cost to you.',
      coverage: '100% covered',
      eligibility: 'All enrolled members',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RTQ5OUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMEJFNkYwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIGZvbnQtZmFtaWx5PSJTYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QklOPC90ZXh0Pjwvc3ZnPg=='
    },
    {
      title: 'Telemedicine Services',
      description: '24/7 access to doctors via video or phone for non-emergency medical issues.',
      coverage: '$0 copay',
      eligibility: 'All enrolled members',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImEiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiM1RTQ5OUIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxMEJFNkYwIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTUlIGZvbnQtZmFtaWx5PSJTYW5zLXNlcmlmIiBmb250LXNpemU9IjMwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+QklOPC90ZXh0Pjwvc3ZnPg=='
    }
  ]
};

// --- LOCAL DOMAIN LOGIC ---

/**
 * Local classification based on keywords (Simulated AI 1 logic).
 * Returns 'INVALID_DOMAIN' if input is clearly irrelevant or too vague.
 */
function analyzeInputLocally(text) {
  const lowerInput = text.toLowerCase();
  const MINIMUM_HEALTH_SCORE = 2; 
  const GREETINGS = ['good morning', 'good afternoon', 'hello', 'hi', 'thanks', 'thank you', 'how are you'];
  const IRRELEVANT_KEYWORDS = ['car', 'repair', 'finance', 'stock', 'invest', 'loan', 'engine', 'school', 'math', 'homework', 'tutorial'];

  const healthKeywords = {
    'Dental': ['tooth', 'teeth', 'dental', 'cavity', 'braces', 'root canal', 'filling'],
    'Mental Health': ['stress', 'sad', 'anxiety', 'therapy', 'counseling', 'overwhelmed'],
    'Vision': ['eye', 'vision', 'glasses', 'contact', 'lasik', 'blurry']
  };

  let bestMatch = 'General';
  let maxScore = 0;
  
  // 1. Calculate Health Score
  for (const [category, words] of Object.entries(healthKeywords)) {
    const score = words.filter(word => lowerInput.includes(word)).length;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }
  
  // 2. Calculate Irrelevant Score
  const isGreeting = GREETINGS.some(greeting => lowerInput.includes(greeting));
  const irrelevantScore = IRRELEVANT_KEYWORDS.filter(word => lowerInput.includes(word)).length;

  // 3. *** DOMAIN REJECTION GUARDRAIL ***
  
  // If Irrelevant score is high AND Health score is low OR the text is just a greeting, REJECT DOMAIN.
  if ((irrelevantScore >= 2 && maxScore < MINIMUM_HEALTH_SCORE) || isGreeting) {
    return 'INVALID_DOMAIN'; // <-- New rejection category
  }

  // 4. Default Health Guardrail
  if (maxScore < MINIMUM_HEALTH_SCORE) {
    return 'General'; // Falls back to general help for vague health needs
  }

  return bestMatch;
}

/**
 * Local action plan generation (Simulated AI 2 logic).
 * STRICTLY returns 3 steps.
 */
function generateActionPlanLocally(benefit) {
  const coverageStep = benefit.coverage ? `Understand your coverage: ${benefit.coverage} is provided for this service.` : 'Review the full benefit details and coverage limits in the employee handbook.';
  
  return [
    `Step 1: Confirm your eligibility with HR or check the benefits portal for ${benefit.eligibility}.`,
    `Step 2: ${coverageStep}`,
    `Step 3: Book your appointment or begin using your benefit—most services are available immediately.`
  ];
}


// --- EXPORTED SERVICE FUNCTIONS ---

/**
 * Analyzes user input to suggest relevant benefits, with a local fallback.
 */
export async function analyzeBenefits(input) {
  const useMock = String(import.meta.env.VITE_USE_MOCK || '').toLowerCase() === 'true';
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-benefits`;

  // --- CORE CHANGE: LOCAL CLASSIFICATION FIRST ---
  const localCategory = analyzeInputLocally(input);
  
  // 1. **IMMEDIATE REJECTION CHECK**
  if (localCategory === 'INVALID_DOMAIN') {
    // Throwing an APIError here allows the UI to catch it and render a custom error screen.
    throw new APIError('Input is outside the domain of health benefits. Please refine your query.', 'DOMAIN_REJECTED', false);
  }
  // If we reach here, the category is 'General' or a specific health category.

  if (useMock) {
    await sleep(800 + Math.random() * 600);
    const benefits = BENEFITS_DATA[localCategory] || BENEFITS_DATA['General'];
    return {
      category: localCategory,
      benefits,
      confidence: localCategory === 'General' ? 'medium' : 'high'
    };
  }

  // Attempt remote call with retry logic...
  try {
    const data = await fetchWithRetry(apiUrl, { /* ... options for remote call ... */ });
    return data;
  } catch (error) {
    // Fallback logic remains the same (handles remote failure, but local domain check already passed)
    console.warn('Remote function unavailable, using local processing:', error.message);
    await sleep(1500 + Math.random() * 1000); 

    const benefits = BENEFITS_DATA[localCategory] || BENEFITS_DATA['General'];
    return {
      category: localCategory,
      benefits,
      confidence: localCategory === 'General' ? 'medium' : 'high'
    };
  }
}

/**
 * Generates an action plan for a specific benefit, with a local fallback.
 */
export async function generateActionPlan(benefitTitle) {
  // ... (Code remains unchanged from the previous version)
  const useMock = String(import.meta.env.VITE_USE_MOCK || '').toLowerCase() === 'true';
  const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-plan`;

  // Find the benefit object for local generation
  let foundBenefit = null;
  for (const benefits of Object.values(BENEFITS_DATA)) {
    foundBenefit = benefits.find(b => b.title === benefitTitle);
    if (foundBenefit) break;
  }

  if (useMock) {
    await sleep(600 + Math.random() * 600);
    if (!foundBenefit) throw new APIError('Benefit not found in mock data', 'NOT_FOUND', false);
    return generateActionPlanLocally(foundBenefit);
  }

  // Attempt remote call with retry logic...
  try {
    const data = await fetchWithRetry(apiUrl, { /* ... options for remote call ... */ });
    return data.actionPlan;
  } catch (error) {
    // Fallback to local processing if remote call fails after all retries
    console.warn('Remote function unavailable, using local processing:', error.message);
    await sleep(1500 + Math.random() * 500); 

    if (!foundBenefit) throw new APIError('Benefit not found in mock data', 'NOT_FOUND', false);
    return generateActionPlanLocally(foundBenefit);
  }
}

export { APIError };