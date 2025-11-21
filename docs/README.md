# RouteIQ Documentation

Welcome to the RouteIQ documentation. This folder contains all technical and strategic documentation for the project.

## Quick Links

**Start Here:**
- [../GETTING_STARTED.md](../GETTING_STARTED.md) - Setup guide to get the app running locally

**Planning & Roadmap:**
- [TODO.md](TODO.md) - Detailed implementation checklist (what's missing to complete Phase 1)
- [ROADMAP.md](ROADMAP.md) - Product vision and development phases

**Technical Documentation:**
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Complete database design and schema
- [SETUP.md](SETUP.md) - Detailed setup instructions and troubleshooting
- [../backend/API_EXAMPLES.md](../backend/API_EXAMPLES.md) - API endpoint documentation

**Design & Strategy:**
- [styleguide.md](styleguide.md) - Frontend design system (colors, typography, components)
- [CLAUDE.md](CLAUDE.md) - Project strategy, goals, and decision-making framework

---

## Document Purposes

### TODO.md
**When to use:** You want to know what features are missing or need implementation.

**What's inside:**
- 8 critical blocking issues that prevent Phase 1 MVP completion
- Detailed implementation steps for each feature
- Priority levels (critical, high, medium, low)
- 4-week recommended implementation schedule
- File paths and technical notes for each task

### ROADMAP.md
**When to use:** You want to understand the long-term product vision.

**What's inside:**
- 4 product development phases
- Phase 1: Running MVP (current focus)
- Phase 2: Advanced running features (weather, predictions, social)
- Phase 3: Workout tracking (gym exercises, progressive overload)
- Phase 4: Cross-training intelligence (correlations, insights)

### DATABASE_SCHEMA.md
**When to use:** You need to understand the data model or modify the database.

**What's inside:**
- All 11 database tables documented
- Field types, constraints, and relationships
- Enums and validation rules
- Example data and use cases
- Prisma schema details

### SETUP.md
**When to use:** You're having trouble getting the app running or need detailed setup info.

**What's inside:**
- Step-by-step setup instructions
- Environment variable configuration
- Database setup (Docker + local PostgreSQL)
- Troubleshooting common issues
- Development workflow tips

### styleguide.md
**When to use:** You're building new frontend components or need design consistency.

**What's inside:**
- Color palette (primary, accent, grays)
- Typography system (Orbitron + Sans-serif)
- Component patterns (nav, cards, buttons)
- Design tokens and usage guidelines

### CLAUDE.md
**When to use:** You're wondering about the strategic direction or need to make product decisions.

**What's inside:**
- Product positioning analysis
- Running-focused vs gym-focused vs hybrid approach
- Market analysis and differentiation strategy
- Decision-making framework for new features
- Strategic questions to answer before expanding scope

---

## Documentation Status

**✅ Up-to-date:**
- TODO.md (updated Nov 21, 2025)
- DATABASE_SCHEMA.md
- styleguide.md
- SETUP.md

**⚠️ May need updates:**
- ROADMAP.md (written before frontend work, may need Phase 1 revision)
- CLAUDE.md (strategic doc from early planning, still relevant)

---

## Contributing to Documentation

When you implement a feature from TODO.md:
1. Mark the item as complete in TODO.md
2. Update ROADMAP.md if it changes the phase completion percentage
3. Update relevant API docs in backend/API_EXAMPLES.md if adding endpoints
4. Update styleguide.md if adding new UI patterns

---

## Need Help?

If you're new to the project:
1. Start with [../GETTING_STARTED.md](../GETTING_STARTED.md)
2. Read [TODO.md](TODO.md) to understand current priorities
3. Check [ROADMAP.md](ROADMAP.md) for the big picture
4. Dive into technical docs as needed

If you're stuck:
- Check [SETUP.md](SETUP.md) troubleshooting section
- Review [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for data model questions
- See [../backend/API_EXAMPLES.md](../backend/API_EXAMPLES.md) for API usage
