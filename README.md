

***

# AI-Powered Benefits Discovery Flow

## SDE Intern Assignment (Problem Statement 4)

This project implements a secure, multi-screen flow built on React to classify an employee's free-text health need using a simulated AI service and provide a robust, actionable plan.

| Feature | Implementation |
| :--- | :--- |
| **Tech Stack** | React, JavaScript (JSX), Context API, Tailwind CSS |

***

## 1. Project Setup & Demo

| Platform | Command |
| :--- | :--- |
| **Web (Local)** | 1. `npm install` 2. `npm run dev` (or `npm start`) |

### Hosted Demo Link

The complete four-screen flow is available and fully functional here:
 [View Live Demo](https://plum-assignment-4.vercel.app/)

***

## 2. Problem Understanding

**Goal:** To classify an employee's free-text health need into a specific category and deliver a high-quality, actionable **3-step plan** for accessing the corresponding benefit.

**Assumption:** All benefit data is loaded from a **mock JSON object**. AI interactions (classification and generation) are **simulated** using complex service logic (`api.js`) to prove client-side async handling and robustness.

***

## 3. AI Prompts & Iterations (The Guardrails)

The solution uses a **two-stage simulated AI process**, heavily emphasizing consistency and input filtering.

### Stage 1: Classification Prompt (Screen 2)

| Prompt | Rationale (Guardrail) |
| :--- | :--- |
| **Refined Prompt:** `'Return ONLY the category name from {Dental, Mental Health, Vision, General} that matches the text: {user\_input}. Nothing else.'` | **Strict Consistency:** Ensures the output is a single, clean string for filtering. **Guardrail Logic** is implemented in `api.js` to reject vague or irrelevant inputs before processing. |

### Stage 2: Action Plan Generation Prompt (Screen 4)

| Prompt | Rationale (Output Control) |
| :--- | :--- |
| **Action Plan Prompt:** `'Generate a 3-step, beginner-friendly action plan explaining how an employee can avail the benefit: {selected\_benefit\_title}. Return the steps as a clean JSON array of strings.'` | **Structured Output:** Strictly enforces the **3-step requirement**, which is validated by the application before display. |

***

## 4. Architecture & Code Structure

### A. Resilience and Guardrails

The **`api.js`** file acts as a resilient service wrapper, demonstrating advanced async handling:

| Guardrail/Technique | Implementation in `api.js` |
| :--- | :--- |
| **Transient Error Handling** | **`fetchWithRetry`** logic including Timeouts, Exponential Backoff, and retries on 5xx/429 status codes. |
| **Domain Rejection** | **Irrelevant Topic/Greeting Guardrail** that forces an `APIError` if the input is outside the health domain (e.g., "car repair"), routing the user to a clean error screen. |
| **API Failure Fallback** | The `analyzeBenefits` function automatically executes **local keyword analysis** if the remote API fails after all retries. |

### B. React Architecture

* **State Management:** **React Context API** (`FlowContext.jsx`) manages the entire sequential flow state (`currentScreen`, `selectedBenefit`, `error`, etc.), separating state logic cleanly.
* **Navigation:** Handled by a clean `switch` statement in `App.jsx`, which also globally renders the full-screen error component if a network or domain error occurs.
* **Modularity:** Screens rely on reusable components like the modular **`BenefitCard`** and the accessible **`TimelineStep`**.

***

## 5. Screenshots

 ![Input Screen Image](/public/screenshots/input.png) 
 ![Loading Classification Screen](/public/screenshots/loading.png) 
 ![Benefits Screen](/public/screenshots/benefits.png) 
 ![Action Plan Screen](/public/screenshots/actionplan.png) 

***

## 6. Known Issues / Improvements

* **Code Improvement:** The `analyzeBenefits` function is currently duplicated in the mock and live branches; refactoring the mock logic into a dedicated mock service file would further enhance clarity.
* **Next Improvement:** Implement **clarifying questions** for the user when the classification confidence is low (e.g., "Did you mean Mental Health or General Wellness?").

***

## 7. Bonus Work

* **Interactive Action Plan:** Steps on Screen 4 can be clicked to toggle a **green checkmark**, providing dynamic user progress tracking.
* **Dark Mode Support:** A fully functional dark mode toggle is implemented and persisted via local storage.
* **Advanced UI/UX:** Custom animated loaders, micro-interactions, and a professional **vertical timeline** design were implemented throughout the flow.
