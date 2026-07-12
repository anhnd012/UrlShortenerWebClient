# LinkFlow Frontend: Architecture, Components, and Usage Guide

LinkFlow is a modern, data-focused, and premium SaaS-style URL Shortener and Analytics web application. This document details the application architecture, component structure, design system, and instructions on how to run, test, and build the project.

---

## 1. Architectural Overview

The LinkFlow frontend is built as a Single Page Application (SPA) using **React 19**, **Vite 8**, and **TypeScript**. It follows clean code practices, separation of concerns, and feature-driven organization.

### Key Architectural Pillars:
1. **Feature-based Structure**: Source code is grouped by domain features (e.g., `short-links`, `analytics`) rather than flat components. This ensures modularity and high maintainability.
2. **Unified API Client & Error Normalization**: A single configured Axios instance encapsulates baseline requests, headers, and timeouts. A custom interceptor normalizes backend and network exceptions into a typed `ApiError` format before reaching components or hooks.
3. **Decoupled Server State**: TanStack Query is used exclusively to fetch, cache, and synchronize server state. Standard React components remain stateless, reading server state from hooks.
4. **Mock-First Development**: A built-in network mock interceptor intercepts Axios requests when `VITE_ENABLE_MOCK_API` is set to `true`. This enables running the frontend locally in the browser with full interactivity (link creation, analytics views, empty states, and errors) without a running backend.

---

## 2. Project Directory Structure

```text
Frontend/
├── .env                  # Environment configurations (enable/disable mock API)
├── package.json          # Node dependencies, scripts, and commands
├── postcss.config.js     # PostCSS configurations for Tailwind CSS v4
├── vite.config.ts        # Vite configuration (aliases, plugins, and Vitest)
├── src/
│   ├── main.tsx          # Application bootstrapping and CSS entrypoint
│   ├── App.tsx           # Providers and Router initialization
│   ├── app/
│   │   ├── providers.tsx    # TanStack Query & Toast providers
│   │   ├── query-client.ts  # TanStack Query config (stale times, retries)
│   │   └── router.tsx       # React Router client-side routes definition
│   ├── layouts/
│   │   └── dashboard-layout.tsx  # Core App Shell with responsive sidebar/topbar
│   ├── pages/
│   │   ├── create-link-page.tsx  # Link creation workspace page
│   │   ├── created-link-page.tsx # Successful link generation result page
│   │   ├── analytics-page.tsx    # Search page and click dashboard detail page
│   │   ├── link-expired-page.tsx # Info screen for expired short URLs
│   │   ├── link-not-active-page.tsx # Info screen for future links
│   │   └── not-found-page.tsx    # Generic 404 page
│   ├── features/
│   │   ├── short-links/          # Link generation domain feature
│   │   │   ├── api/              # Create short link POST call
│   │   │   ├── components/       # CreateLinkForm & ShortLinkPreview
│   │   │   ├── hooks/            # useCreateShortLink mutation hook
│   │   │   ├── schemas/          # Zod validator (IP filters, protocol pre-prepends)
│   │   │   └── types/            # TypeScript contracts (Requests, Responses)
│   │   └── analytics/            # Clicks analytics visualization feature
│   │       ├── api/              # Get analytics query details
│   │       ├── components/       # FilterBar, Metrics Summary, Charts, and Breakdowns Table
│   │       ├── hooks/            # useLinkAnalytics query hook
│   │       └── types/            # Clicks aggregates types
│   ├── components/
│   │   └── common/               # Shared cross-cutting components
│   │       ├── page-header.tsx   # Premium titles
│   │       ├── loading-state.tsx # Spinners and loaders
│   │       ├── error-state.tsx   # Fallback error screens
│   │       ├── empty-state.tsx   # Informative empty records views
│   │       └── toast.tsx         # Custom snackbar notifications provider
│   ├── lib/
│   │   ├── api-client.ts         # Axios client and mock interceptors
│   │   ├── env.ts                # Environment verification module
│   │   ├── date-time.ts          # Client timezones and local formatting helpers
│   │   ├── clipboard.ts          # Clipboard copy API with document fallbacks
│   │   └── cn.ts                 # Classname joiner utility (clsx + twMerge)
│   ├── mocks/
│   │   └── handlers.ts           # MSW mock handlers for integration tests
│   └── test/
│       ├── setup.ts              # Vitest global environment configs
│       └── unit.test.ts          # Unit tests (normalizers, offsets, IP filters)
```

---

## 3. UI Component Inventory

All interfaces utilize utility classes in Tailwind CSS mapping to a clean, data-focused, minimal SaaS design system (Light Mode).

### Common Layout Elements:
* **DashboardLayout**: Defines the overall layout grid (240px sidebar, 64px topbar, and a centered content max-width of 1280px). Implements collapsible sidebar drawers on mobile.
* **PageHeader**: Controls layout titles, subtitles, and consistent action buttons.
* **Toast**: Manages dismissible notification alerts at the bottom right.

### States and Fallbacks:
* **LoadingState**: Renders clean, animated spinners.
* **ErrorState**: Shows warnings, descriptive error messages, and triggers a retry action callback.
* **EmptyState**: Presents clear illustrations, descriptions, and a primary CTA (e.g. for shortcodes with zero click activity).

### Form and Preview Elements:
* **CreateLinkForm**: Integrates React Hook Form with Zod. Includes destination URL input, expiration presets (7 days, 30 days, Custom), and custom date/time/timezone inputs.
* **ShortLinkPreview**: Live card that dynamically reflects input parameters in real-time as the user typing, showing expiration dates and status metrics.

### Analytics Elements:
* **AnalyticsFilterBar**: Responsive inputs to filter metrics by from-date, to-date, and timezone.
* **AnalyticsSummary**: Displays 4 metric cards: Total clicks, Daily average clicks, Peak day metrics, and the current Date Range.
* **DailyClicksChart**: Premium responsive Recharts line chart illustrating daily clicks with custom hover tooltips.
* **DailyClicksTable**: Backs up the chart by showing click counts and percentage distributions sorted by date.

---

## 4. Application Configuration & Local Development

### Prerequisites:
Make sure you have Node.js (v18 or higher) and npm installed.

### Setup and Install:
1. Navigate into the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally:
To start the Vite local development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### Environment Configuration:
Configuration is managed in the `.env` file at the root of the `/Frontend` directory:
* `VITE_API_BASE_URL`: URL to your running Spring Boot backend (defaults to `http://localhost:8080`).
* `VITE_PUBLIC_SHORT_URL_BASE`: Hostname used for generated short URLs (defaults to `http://localhost:8080`).
* `VITE_ENABLE_MOCK_API`: Set to `true` to run completely offline with simulated server responses. Set to `false` to redirect calls to the real Spring Boot endpoints.

---

## 5. Build, Testing, and Quality Control

The project is configured with strict quality checks. Verify these commands pass before committing any changes.

### Running Unit Tests:
Runs the Vitest test suites (checking normalization, IP filters, dates, and calculations):
```bash
npm run test
```

### Static Type Checks:
Runs the TypeScript compiler in compiler-only mode to check for type-safety:
```bash
npm run typecheck
```

### Code Linting:
Runs Oxlint on the project to analyze files for code styling and quality issues:
```bash
npm run lint
```

### Production Build compilation:
Compiles and bundles the application for production deployment inside the `dist/` directory:
```bash
npm run build
```
