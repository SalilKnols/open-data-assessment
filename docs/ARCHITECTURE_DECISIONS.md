# Technical Architecture Deep Dive & Feature Specs

**Date:** 2026-01-15
**Project:** NashTech SurveyHub

---

## 1. The Core Data Decision: JSONB vs. Classical Relational
**The Challenge:** Why use PostgreSQL `JSONB` instead of a traditional normalized SQL schema (Tables for Questions, Pages, Options, etc.)?

### Option A: Classical Relational Model (The "Normalized" Way)
In this model, you break everything down into separate tables.
*   `Surveys` (id, title)
*   `Pages` (id, survey_id, order)
*   `Questions` (id, page_id, text, type)
*   `QuestionOptions` (id, question_id, label, value) - *for checkboxes/radio*
*   `Responses` (id, survey_id, user_id)
*   `Answers` (id, response_id, question_id, text_value, int_value, option_id)

**Why this fails for Dynamic Surveys:**
1.  **The "Join Bomb":** To render **one** survey, the backend must join 4+ tables. For a 50-question survey, fetching the structure becomes an expensive, complex query map.
2.  **Rigidity:** If you want to add a "Slider" question type with `min`, `max`, and `step` attributes, you have to alter the `Questions` table schema adds columns likely null for other types, or create a `QuestionAttributes` EAV table (Entity-Attribute-Value), which is a known anti-pattern for performance.
3.  **Write Complexity:** Saving a user's response requires inserting 1 row into `Responses` and N rows into `Answers` inside a transaction.

### Option B: The JSONB Approach (The "Hybrid" Way)
We use PostgreSQL as a Relational DB for the high-level entities, but use `JSONB` for the dynamic parts.
*   `Surveys` (id, title, owner_id, **structure_json**)
*   `Responses` (id, survey_id, **answers_json**)

**Why this wins:**
1.  **Single Query Render:** Fetching a survey structure is `SELECT structure_json FROM surveys WHERE id = 1`. It is instant.
2.  **Schema Flexibility:** Adding a "Slider" question? Just add it to the JSON in the frontend builder. The backend stores it without needing a schema migration.
3.  **Performance:** Reading/Writing a response is 1 row. Statistics are calculated using Postgres's powerful JSON operators (e.g., `answers->>'rating'`).

**Verdict:**
For a **Survey Platform**, JSONB is the industry standard approach because Survey Structures are inherently hierarchical documents, not flat relations. It offers the **flexibility of NoSQL (MongoDB)** with the **ACID compliance and reliability of PostgreSQL**.

---

## 2. Feature Breakdown & Service Boundaries

Instead of thinking "Monolith vs Microservices" immediately, we define **Functional Modules**. These can start as packages in a Monolith and move to Microservices when distinct scaling is needed.

### Module 1: Identity & Access Management (IAM)
*   **Features:**
    *   User Registration / Login (Email, SSO support).
    *   Organization Management (Tenants).
    *   Role-Based Access Control (RBAC) - Admin, Editor, Viewer, Respondent.
*   **Service Candidate?** High. Often extracting Auth to a separate service (or using Keycloak/Auth0) is step 1.

### Module 2: Survey Manager (The "Builder")
*   **Features:**
    *   CRUD for Survey Metadata (Title, Description, Status).
    *   **Structure Versioning:** Tracking changes to questions over time.
    *   Logic/Branching configuration ("If Q1=Yes, show Q2").
    *   Validation Rules Engine configuration.
*   **Technology:** Heavily utilizes the `surveys` table and JSON schema validation.
*   **Service Candidate?** Low/Medium. Can stay coupled with the core initially.

### Module 3: Response Engine (The "Runner")
*   **Features:**
    *   **High-Volume Ingestion:** This module takes the heat when a survey goes viral.
    *   Session Management: "Save and Continue later".
    *   Validation: Ensuring answers match the survey constraints before saving.
    *   Anti-Spam / Rate Limiting.
*   **Service Candidate?** **VERY HIGH**. This receives 100x more traffic than the Builder. Separating this allows us to scale it independently (e.g., Run 50 instances of the Runner but only 2 of the Builder).

### Module 4: Analytics & Reporting
*   **Features:**
    *   Aggregations: "Average score per Query".
    *   Exporting: Generates CSV/Excel/PDF (CPU intensive).
    *   Data Visualization API.
*   **Technology:** Read-heavy. Might use Read Replicas of the DB.
*   **Service Candidate?** **High**. Report generation is slow and CPU heavy. We don't want a massive Excel export to slow down the Response Engine for other users.

### Module 5: Intelligence (AI)
*   **Features:**
    *   Sentiment Analysis on text responses.
    *   "Smart Recommendations" based on scoring logic (The ODA legacy feature).
    *   Auto-summary of open-ended feedback.
*   **Service Candidate?** Medium. Depends on how heavy the AI processing is.

---

## 3. Proposed Backend Architecture (MVP Phase)

We will build a **Modular Monolith** first, ensuring strict package boundaries.

**Package Structure:**
```
com.nashtech.surveyhub
  ├── iam/           (Users, Auth)
  ├── builder/       (Survey creation logic)
  ├── runner/        (Submission acceptance logic)
  ├── analytics/     (Stats & Exports)
  └── common/        (Shared utils)
```

**Why not Microservices Day 1?**
Microservices add "Distributed System Tax" (Network latency, complex deployments, eventual consistency issues). It is faster to build a Modular Monolith and extract he `Analytics` or `Runner` service later if performance testing proves we need it.

---

## 4. Immediate Next Steps for "Feature Definition"

We need to spec out the data payload for exactly **how** we store the Survey JSON.

**Action Item:** Define the **"Survey Schema JSON Contract"**.
*   How do we define a text question?
*   How do we define a validation rules?
*   How do we store branching logic in JSON?

This contract is the most critical piece of engineering in the entire system.
