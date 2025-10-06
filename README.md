AI-Powered Benefits Discovery Flow

1. Project Setup & Demo
- Web (Vite + React):
  - Install: `npm install`
  - Run dev server: `npm run dev`
  - Open: printed local URL (usually `http://localhost:5173`)
- Optional Mock Mode:
  - Create `.env` and set `VITE_USE_MOCK=true` to bypass backend and use deterministic mock data.
- Supabase (optional real backend):
  - If you have a Supabase project with the Edge Function deployed, set:
    - `VITE_SUPABASE_URL=<your-url>`
    - `VITE_SUPABASE_ANON_KEY=<your-anon-key>`

2. Problem Understanding
- Goal: Classify employee health needs into a benefit category and display 2–4 benefits with a 3-step+ action plan.
- Assumptions: App can run fully offline using mock classification and mock benefit catalog; backend calls are optional.

3. AI Prompts & Iterations (Implemented Behavior)
- Classification prompt (backend optional): Return ONLY one of {Dental, Vision, Mental Health, General}.
- Fallback: When input can’t be confidently classified, the UI offers quick category choices and a CTA to refine the query.
- Action Plan prompt (backend optional): Return a concise, numbered plan. Frontend also supports Regenerate to ensure consistency.

4. Architecture & Code Structure
- Screens: `InputScreen`, `LoadingScreen`, `BenefitsScreen`, `ActionPlanScreen`.
- State: `src/context/FlowContext.jsx` holds `currentScreen`, `inputText`, `aiCategory`, `benefits`, `selectedBenefit`, `actionPlan`.
- Routing: `App.jsx` renders screens based on `currentScreen`.
- AI Client: `src/services/api.js`
  - `VITE_USE_MOCK=true` → local analysis and plan generation
  - otherwise → Supabase Edge Function `analyze-benefits`
  - robust retries with exponential backoff and timeouts
- UI: `Button`, `Card`, `ErrorMessage` components for consistency.

5. UX Details
- Loading: Animated loaders on classification and plan generation.
- Errors: `ErrorMessage` shows retry/dismiss; API retries on transient failures.
- Regenerate: `ActionPlanScreen` includes a Regenerate Plan button.
- Start Over: Global “Start Over” actions to return to input.
- Accessibility: Keyboard-accessible step checklist and labeled navigation buttons.

6. How to Run in Mock Mode (for evaluation)
- Create `.env` with:
  - `VITE_USE_MOCK=true`
- Start with `npm run dev` and test without any backend credentials.

7. Known Issues / Improvements
- Edge inputs can still be ambiguous; a clarifying question UI is included when no benefits are found.
- Potential enhancement: store session history to compare regenerated plans.
- Add analytics to understand which categories are most selected after fallback.

8. Evaluation Mapping
- AI prompt quality & consistency: deterministic mock, strict outputs, regenerate support.
- UI/UX polish: animated loaders, consistent cards/buttons, clear error and start-over paths.
- Code quality: modular screens, reusable UI, typed-like API error handling, retries.
- Async handling: exponential backoff, timeouts, retry-aware error UI.
- Creativity/details: interactive step checklist, copy-to-clipboard, fallback clarifier, mock toggle.
