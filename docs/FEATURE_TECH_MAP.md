# Feature List & Technology Map
## Simple Explanation of What We Are Building

**Date:** 2026-01-15
**Project:** NashTech SurveyHub

---

### 1. The "Survey Builder" (For Admins)
**What it is:** A drag-and-drop tool where Admins (like you) build the survey forms. You add questions, set rules (e.g., "required"), and design the flow.

| Technology Used | Why is it relevant? |
| :--- | :--- |
| **Angular Drag-and-Drop** | Makes it easy to reorder questions just by clicking and dragging. No coding needed for the admin. |
| **JSON Data Format** | We save the whole survey design as one simple "text file" (JSON) in the database. This lets us change the survey structure instantly without breaking the database. |
| **Live Preview Mode** | Lets you see exactly what the user will see while you are building it, saving time on testing. |

---

### 2. The "Survey Runner" (For Users)
**What it is:** The actual page the user sees when they click your link. It loads the questions, accepts their answers, and says "Thank You".

| Technology Used | Why is it relevant? |
| :--- | :--- |
| **Angular Dynamic Forms** | Instead of writing code for every new survey, this generic code reads your design and "generated" the form on the fly. Infinite flexibility. |
| **PostgreSQL (Database)** | A super reliable, open-source vault to store the answers. Unlike Excel, it can handle thousands of people submitting at the same time without crashing. |
| **Lazy Loading** | We only load the parts of the app the user needs. This makes the survey load super fast on mobile 4G. |

---

### 3. The "Intelligence Engine" (AI Features)
**What it is:** The smart part that analyzes answers. It can check if a comment is "angry" or "happy" (Sentiment) or give personalized advice (Recommendations).

| Technology Used | Why is it relevant? |
| :--- | :--- |
| **Google Gemini API** | A powerful AI brain that we plug into. We send it the user's answers, and it sends back smart insights in seconds. |
| **Prompt Templates** | You write a "recipe" for the AI (e.g., "If score is low, suggest training"). This keeps you in control of what the AI says. |

---

### 4. The "Analytics Dashboard" (Reports)
**What it is:** Where you see the results. Charts, graphs, and export buttons.

| Technology Used | Why is it relevant? |
| :--- | :--- |
| **Chart.js / Ng2-Charts** | Turns boring numbers into beautiful colorful bars and pie charts. Easier to present to management. |
| **Spring Boot Async Processing** | If you ask to download 10,000 results, we do it in the background so the website doesn't freeze up while you wait. |
| **Excel Library (Apache POI)** | Creates real professional Excel files (not just messy text) so you can do further analysis if you want. |

---

### 5. Identity & Security (Login System)
**What it is:** Keeps the bad guys out and lets your team log in.

| Technology Used | Why is it relevant? |
| :--- | :--- |
| **JWT (JSON Web Tokens)** | A digital "ID card" the browser keeps. The user logs in once, and stays logged in securely without needing to type their password on every page refresh. |
| **Role-Based Access** | Separation of power. "Admins" can delete surveys, but "Viewers" can only look at results. Prevents accidents. |

---

### Summary of Tech Stack "Why"

*   **Java (Spring Boot):** We chose this because it's rock-solid, used by big banks and enterprises. It won't crash easily.
*   **PostgreSQL:** It's free (Open Source), powerful, and you own your data. No finding out later that you have to pay Google huge fees.
*   **Angular:** It's built by Google for building "Big" apps. It keeps our complex logic organized so the code doesn't become a mess in 2 years.

