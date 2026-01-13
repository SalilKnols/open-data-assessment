# NashTech SurveyHub

A dynamic, open-source survey platform built with Angular and Spring Boot. Create custom surveys, collect responses, and analyze data with AI-powered insights.

**Formerly:** Open Data Assessment

## Project Structure

```
nashtech-surveyhub/
├── frontend/          # Angular application
├── backend/           # Spring Boot REST API
└── docs/             # Documentation and proposals
```

## Current Status

🚧 **In Development** - Project restructuring in progress

### Branches
- `main` - Production ODA code
- `oda-frozen` - Archived ODA implementation
- `develop` - Active development branch
- `feature/project-restructure` - Current work (folder reorganization)

## Quick Start

### Frontend (Angular)
```bash
cd frontend
npm install
npm start
# Open http://localhost:4200
```

### Backend (Spring Boot) - Coming Soon
```bash
cd backend
./mvnw spring-boot:run
# API will be available at http://localhost:8080
```

## Original Project: NashTech Open Data Assessment

This project started as an implementation of the ODI (Open Data Institute) maturity framework with:
- 47 questions across 5 themes
- AI-powered recommendations (Google Gemini)
- PDF/Excel export capabilities
- 5-level maturity scoring

The ODA will be migrated as "Survey #1" in the new platform.

## Roadmap

- [x] Project restructure (frontend/ + backend/)
- [ ] Spring Boot backend foundation
- [ ] PostgreSQL database setup
- [ ] Dynamic survey rendering engine
- [ ] Admin dashboard & survey builder
- [ ] ODA migration as Survey #1

## Tech Stack

| Layer     | Technology                    |
| --------- | ----------------------------- |
| Frontend  | Angular 19+, TypeScript, SCSS |
| Backend   | Spring Boot 3, Java 17+       |
| Database  | PostgreSQL 16+                |
| AI        | Google Gemini API             |
| Container | Docker + Docker Compose       |

## Documentation

- [Architecture Proposal](docs/SURVEY_PLATFORM_PROPOSAL.md)
- [Branching Strategy](docs/BRANCHING_STRATEGY.md)
- [UI Style Guide](docs/UI_STYLE_GUIDE.md)

---

**License:** To be determined  
**Maintainer:** NashTech
