# Comprehensive Technical Specifications & Logic Flows

**Date:** 2026-01-15
**Project:** NashTech SurveyHub
**Document Goal:** To define every single logical step and data structure decision in granular detail.

---

## Part 1: Deep Dive into Data Architecure (JSONB)

### 1.1 The Core Problem: Storing Unknown Questions
In a standard app (like an e-commerce store), we know the fields ahead of time: `Product Name`, `Price`, `SKU`.
In a Survey app, **we do not know** what the admin will create.
*   Admin A creates a 3-question survey.
*   Admin B creates a 50-page survey with complex logic.

### 1.2 "Classical" SQL Approach (And why we rejected it)
To store a dynamic survey using standard SQL tables, we would need this exact schema:

```sql
-- Table 1: The Survey
INSERT INTO surveys (id, title) VALUES (1, 'Feedback');

-- Table 2: The Pages
INSERT INTO pages (id, survey_id, page_order) VALUES (101, 1, 1);

-- Table 3: The Questions
INSERT INTO questions (id, page_id, text, type) VALUES (500, 101, 'Do you like us?', 'radio');

-- Table 4: The Options (Only for radio/checkbox)
INSERT INTO options (id, question_id, text) VALUES (900, 500, 'Yes');
INSERT INTO options (id, question_id, text) VALUES (901, 500, 'No');
```

**The Problem:**
To load **ONE** survey to show to the user, the database must:
1.  Find the survey (1 read)
2.  Find all pages (1 read)
3.  Find all questions for those pages (1 read)
4.  Find all options for those questions (1 read)
5.  **Stitch them all together** in memory.

This is slow (`O(log n)` complexity) and fragile.

### 1.3 The JSONB Approach (Our Choice)
We store **the entire definition** in one single column called `schema` inside the `surveys` table.

```json
{
  "pages": [
    {
      "id": "p1",
      "elements": [
        {
          "type": "radiogroup",
          "name": "satisfaction",
          "title": "Do you like us?",
          "choices": [
            { "value": "yes", "text": "Yes" },
            { "value": "no", "text": "No" }
          ]
        }
      ]
    }
  ]
}
```

**Why this specific structure?**
*   **"pages" array:** Allows us to support multi-page surveys (like the ODA one).
*   **"elements" array:** We call them "elements" instead of "questions" because sometimes you might want to add just a text block (instructions) or an image that isn't a question.
*   **"name" vs "title":**
    *   `title`: What the user sees ("Do you like us?").
    *   `name`: The internal variable ID (`satisfaction`). This is crucial for analytics. If you fix a typo in the Title, the Name stays the same, so your data stays consistent.

---

## Part 2: Detailed Feature Logic Flows

### Feature: Creating a Survey (Step-by-Step)

**Actor:** Admin
**Component:** Survey Builder

**Detailed Flow:**
1.  **Initial Load:**
    *   Admin clicks "Create New".
    *   System initializes an empty JSON object: `{ "pages": [ { "name": "page1", "elements": [] } ] }`.
    *   UI renders an empty canvas.
2.  **Adding a Question:**
    *   Admin drags "Text Question" from sidebar.
    *   **Logic:** System generates a unique ID (e.g., `q_159753`).
    *   **Logic:** System pushes a new object into the `elements` array: `{ "type": "text", "name": "q_159753", "title": "Question 1" }`.
    *   UI updates instantly to show the question.
3.  **Editing Properties:**
    *   Admin clicks the question.
    *   Admin types "What is your name?" in the Title box.
    *   **Logic:** Angular updates the `title` field in the local JSON variable.
4.  **Saving:**
    *   Admin clicks "Save".
    *   **Validation:** System checks: "Does every question have a title?", "Are the unique IDs actually unique?".
    *   **Transmission:** Angular sends the entire JSON object to Backend API (`POST /api/surveys`).
    *   **Storage:** Spring Boot takes the JSON and saves it into the `schema` column of the `surveys` table.

---

### Feature: Taking a Survey (The "Runner")

**Actor:** User (Respondent)
**Component:** Survey Runner

**Detailed Flow:**
1.  **Fetching:**
    *   User visits `nashtech.com/survey/123`.
    *   Backend executes `SELECT schema FROM surveys WHERE id = 123`.
    *   **Efficiency:** This is **1 database hit**. Super fast.
2.  **Render Loop (The Core Engine):**
    *   Angular gets the JSON.
    *   It starts a loop: `For each Page in Pages`.
    *   Inside that: `For each Element in Page`.
    *   **Switch Case:**
        *   If `type == 'text'`, render `<input type="text">`.
        *   If `type == 'radiogroup'`, render a list of `<input type="radio">`.
        *   If `type == 'rating'`, render the Star Component.
3.  **Capturing Answers:**
    *   User types "John".
    *   Angular stores this in a simple results object: `{ "q_159753": "John" }` (Using the unique 'name' ID we created earlier).
4.  **Submission:**
    *   User clicks "Submit".
    *   Angular sends the results object `{ "q_159753": "John" }` to backend.
    *   **Optimization:** Backend does **not** need to parse this. It just validates "Is this valid JSON?" and saves it directly to the `answers` column in `responses` table.

---

### Feature: AI Integration (The "Intelligence")

**Actor:** Background Service
**Component:** AI Engine

**Detailed Flow:**
1.  **Trigger:** After the User clicks "Submit".
2.  **Context Fetch:** System looks at the Survey Config.
    *   *Config:* `AI_Enabled = True`
    *   *Prompt:* "Analyze the feedback below..."
3.  **Processing:**
    *   Backend takes the Results JSON: `{ "comment": "Service was slow but food was good" }`.
    *   Backend combines it with the Prompt: "Analyze the feedback below: Service was slow but food was good".
    *   Sends to Google Gemini API.
4.  **Storage:**
    *   Gemini returns: "Mixed sentiment. Issue: Speed. Strength: Quality."
    *   Backend updates the `responses` row to add this text into a `ai_analysis` column.
    *   **Why separate?** We enable the AI analysis to be searchable later in the dashboard.

---

## Part 3: Why This Tech Stack? (Granular Relevance)

**1. Angular (Frontend)**
*   **Why:** We need **Reactive Forms**.
*   **Detail:** Angular has a built-in library called `ReactiveForms` that is specifically designed to build forms from code structures (like our JSON) rather than HTML. React requires 3rd party libraries to do this well; Angular does it natively.

**2. Spring Boot (Backend)**
*   **Why:** Type Safety & Enterprise Ecosystem.
*   **Detail:** When handling data for "NashTech" (an enterprise), we need guarantees. Java is strict. It prevents us from accidentally saving a "String" where a "Number" should be. Also, Spring Security provides industry-standard Login protection out of the box.

**3. PostgreSQL (Database)**
*   **Why:** The `JSONB` Operator.
*   **Detail:** Postgres is unique. MySQL has JSON, but Postgres has `JSONB` (Binary JSON).
*   **Meaning:** Postgres actually indexes the JSON keys. We can query: `SELECT * FROM responses WHERE answers->>'satisfaction' = '5'`. This runs as fast as a normal SQL query. Other databases scan every single row (slow). This is the "Secret Sauce" of our performance.
