# NashTech Open Data Maturity Assessment — Improved UI and Excel Export

This project is a practical implementation of the Open Data Institute (ODI) maturity framework. It provides a guided questionnaire, a modern Angular user interface, and an export feature that generates multi-sheet Excel reports.

The goal is to help teams and organisations assess their open data practices, capture results, and produce clear, shareable reports.

## Key Improvements

### UI and Usability
- Form fields and icons aligned for a cleaner layout
- Reduced header height and padding to make better use of screen space
- Help sections aligned with content for clearer guidance
- More compact result cards and sections for improved information density
- Improved responsiveness for tablet and mobile screens

### Excel Export
- Generates professional Excel files with multiple worksheets
- Exports scores, responses, and analysis data
- Automatic file naming that includes organisation and timestamp
- Multi-sheet layout: Summary, Detailed Responses, and Theme Analysis

### General Experience
- Faster load times through optimized components
- Improved visual hierarchy and accessibility
- Smoother transitions and focused UI improvements

## ODI Framework Coverage

This assessment follows the ODI maturity model and includes 37 questions organised by theme:

- Data Publication Process (8 questions)
- Data Literacy and Skills (6 questions)
- Customer Support and Engagement (9 questions)
- Investment and Financial Performance (6 questions)
- Strategic Oversight (8 questions)

Responses are scored using the official five-level maturity scale:

1. Initial — Ad-hoc processes with limited structure
2. Repeatable — Some processes exist but are inconsistent
3. Defined — Documented processes and standards
4. Managed — Processes are monitored and managed
5. Optimising — Continuous improvement and innovation

## Design Notes

- Primary color: #0066cc
- Accent color: #ff6600
- Compact components and reduced padding for denser layouts
- SCSS-based styling with a focus on readability and accessibility

## Quick Start

### Prerequisites

- Node.js 18 or later
- Angular CLI 17 or later
- A modern web browser with JavaScript enabled

### Install and run locally

```bash
npm install
ng serve

# Then open http://localhost:4200 in your browser
```

### Build for production

```bash
ng build --configuration production
```

## Features

- Guided questionnaire following the ODI model
- Progress tracking and auto-save of answers
- Results dashboard with overall and theme-based scores
- Excel export with Summary, Detailed Responses, and Theme Analysis sheets
- Offline storage for in-progress assessments

## Excel Export Details

The exported Excel file includes at least three sheets:

- Summary: participant details, overall score, maturity level, and recommendations
- Detailed Responses: question-level answers, individual scores (1–5), and theme labels
- Theme Analysis: aggregated statistics, average scores, and maturity levels by theme

The export applies simple formatting, automated file naming, and basic validation to aid sharing and reporting.

## Technical Overview

- Angular (standalone components) and TypeScript
- Reactive Forms for handling user input and validation
- RxJS for reactive state handling
- Angular Material components with custom theming
- SCSS for styling

Performance considerations include route-based lazy loading and OnPush change detection where appropriate.

## Contributing and Support

To run the app locally:

- Use `ng serve` from the project root
- Edit or extend the assessment questions and configuration under `src/app`
- The Excel export logic is implemented in `src/app/services/assessment.service.ts`

If you need help adapting the project for your organisation, contact the repository owner or the team that provided these files.

## Resources

- Open Data Institute: https://theodi.org

---

If you want a shorter introduction, a different tone, or more examples of the exported Excel layout, tell me how you'd like it adjusted.
