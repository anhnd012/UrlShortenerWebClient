# LinkFlow Frontend: Architecture, Components, and Usage Guide

LinkFlow is a modern, data-focused, and premium SaaS-style URL Shortener and Analytics web application. This document details the application architecture, component structure, design system, and instructions on how to run, test, and build the project.

---

## 1. Architectural Overview

The LinkFlow frontend is built as a Single Page Application (SPA) using **React 19**, **Vite 8**, and **TypeScript**. It follows clean code practices, separation of concerns, and feature-driven organization.

### Key Architectural Pillars:
1. **Feature-based Structure**: Source code is grouped by domain features (e.g., `short-links`, `analytics`) rather than flat components. This ensures modularity and high maintainability.
2. **Multi-Layout Route Isolation**: Page domains are split into distinct parent layout bundles:
   - `PublicLayout`: Encapsulates marketing headers and public pages (e.g. `/`).
   - `AuthLayout`: Wraps authentication pages (e.g. `/login`, `/signup`).
   - `DashboardLayout`: Wraps the authenticated app dashboard (e.g. `/create`, `/analytics`).
3. **Unified API Client & Error Normalization**: A single configured Axios instance encapsulates baseline requests, headers, and timeouts. A custom interceptor normalizes backend and network exceptions into a typed `ApiError` format before reaching components or hooks.
4. **Mock-First Development**: A built-in network mock interceptor intercepts Axios requests when `VITE_ENABLE_MOCK_API` is set to `true`. This enables running the frontend locally in the browser with full interactivity (link creation, analytics views, empty states, and errors) without a running backend.

---

## 2. Project Directory Structure

```text
Frontend/
├── .env                  # Environment configurations (enable/disable mock API, auth requirements)
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
│   │   ├── public-layout.tsx     # Public Layout wrapper (with marketing nav menu)
│   │   ├── auth-layout.tsx       # Authentication Layout wrapper (login/signup)
│   │   └── dashboard-layout.tsx  # Core App Shell with collapsible desktop/mobile sidebar
│   ├── pages/
│   │   ├── landing-page.tsx      # Public landing / marketing page
│   │   ├── login-page.tsx        # Split layout email/password login page
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
│   │       ├── user-menu.tsx     # Account dropdown menu (with Mode B disabled log out)
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
* **DashboardLayout**: Manages the desktop sidebar width toggle (240px expanded vs 72px collapsed). Reads/saves preference to `localStorage` under `linkflow.sidebar.collapsed`.
* **Sidebar**: Rendered inside `DashboardLayout`. Collapses on desktop (hiding labels and showing title-based tooltips on navigation items). On mobile/tablet, it falls back to an off-canvas slide-out drawer with a background overlay backdrop.
* **Topbar**: Sticky header displaying the collapsible toggle menu (on mobile) and housing the `UserMenu` in the top right.
* **UserMenu**: Renders user avatar initials (SU), displays name and email metadata, and opens an accessible dropdown containing profile and settings anchors and a disabled **Log out** button with warning helpers (Mode B).
* **PublicLayout**: Renders a dedicated header showing product logo, marketing menu links (Features), and redirect triggers to Login/Signup.
* **AuthLayout**: Full-width centered container for clean, form-focused layouts.

### Pages & Specialized Views:
* **LandingPage (`/`)**: Displays the product marketing value proposition, dark hero header background, features description cards, and includes an embedded url shortening card. It runs Zod validation checks and contacts the short link POST API for immediate redirection to the created success page.
* **LoginPage (`/login`)**: Built as a balanced 60/40 two-column layout. The left column manages email input validation, password input with show/hide eye-toggles, and a disabled submit button displaying an authentication notice. The right column renders a CSS visual graphic panel balancing the layout.

---

## 4. Developer Onboarding: Code Execution Flows

Trace code paths step-by-step through standard user workflows.

### Flow A: App Bootstrapping and Routing
1. **Bootstrapping**:
   * Execution starts in [src/main.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/main.tsx). It imports the global CSS styles ([globals.css](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/styles/globals.css)) and renders the `<App />` root component.
2. **Providers & Router Init**:
   * [src/App.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/App.tsx) wraps the app with `<Providers>` (TanStack Query client and Custom Toast context) and mounts the `<RouterProvider router={router} />` router definition.
3. **Route Mapping**:
   * [src/app/router.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/app/router.tsx) separates layout structures. It matches `/` to `<PublicLayout />`, `/login` to `<AuthLayout />`, and dashboard routes (`/create`, `/analytics`) to `<DashboardLayout />`.

---

### Flow B: Creating a Short Link
1. **Form Input**:
   * The user inputs a destination URL on either [landing-page.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/pages/landing-page.tsx) or [create-link-page.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/pages/create-link-page.tsx).
   * The page mounts [create-short-link-form.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/short-links/components/create-short-link-form.tsx).
2. **Validation**:
   * The form is controlled via React Hook Form and validated with Zod in [create-short-link.schema.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/short-links/schemas/create-short-link.schema.ts).
   * Zod calls `normalizeUrl` (checking and prepending missing `https://` protocols) and `isPrivateOrLocalUrl` (blocking local addresses).
3. **Mutation Hook Execution**:
   * Submitting triggers the page handler, calling `createLink` from the `useCreateShortLink` hook ([use-create-short-link.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/short-links/hooks/use-create-short-link.ts)).
   * The hook calls `createShortLink` ([create-short-link.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/short-links/api/create-short-link.ts)).
4. **Axios Client Interception (Mock Mode)**:
   * The HTTP POST request goes to the Axios [api-client.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/lib/api-client.ts).
   * If `VITE_ENABLE_MOCK_API=true`, the mock request interceptor blocks the outgoing network request, triggers a `setTimeout` (simulating network latency), generates a random 6-character short code, and returns a mocked response object.
5. **Success Redirect & Visual Confirmation**:
   * The mutation resolves. The page calls `toast` (visual success) and triggers `navigate('/created', { state: { result } })`.
   * [created-link-page.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/pages/created-link-page.tsx) reads the navigation state, displays the generated URL, and runs `copyToClipboard` ([clipboard.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/lib/clipboard.ts)) when copying the link.

---

### Flow C: Querying Analytics Details
1. **Route Params Extraction**:
   * The user navigates to `/analytics/:shortCode`.
   * [analytics-page.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/pages/analytics-page.tsx) reads the `shortCode` path parameter using React Router's `useParams`.
2. **Query Hook Execution**:
   * The page triggers `useLinkAnalytics(shortCode, filters)` ([use-link-analytics.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/analytics/hooks/use-link-analytics.ts)).
   * The hook delegates request fetching to `getLinkAnalytics` ([get-link-analytics.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/analytics/api/get-link-analytics.ts)).
3. **Axios Interception (Mock Mode)**:
   * The Axios client ([api-client.ts](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/lib/api-client.ts)) catches the `GET /api/v1/analytics/{shortCode}` request.
   * If in mock mode, it generates mocked daily click statistics for the last 7 days and returns the response. If the code equals `'notfound'`, it rejects with a `404` error payload.
4. **Error/Empty/Success Render Branching**:
   * **Loading**: Renders `<LoadingState />`.
   * **Error**: The Axios interceptor normalizes the error using `normalizeError` in `api-client.ts`. The page catches the error and renders `<ErrorState />` displaying the formatted message.
   * **Empty**: If the total clicks count equals `0`, it renders `<EmptyState />`.
   * **Success**: Renders:
     - `AnalyticsFilterBar`: for modifying dates/timezones.
     - `AnalyticsSummary`: showing clicks metrics calculated in [analytics-summary.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/analytics/components/analytics-summary.tsx).
     - `DailyClicksChart`: rendering the Recharts line chart ([daily-clicks-chart.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/analytics/components/daily-clicks-chart.tsx)).
     - `DailyClicksTable`: sorting and presenting click percentages ([daily-clicks-table.tsx](file:///d:/API/PetProjects/URL%20Shortener/Frontend/src/features/analytics/components/daily-clicks-table.tsx)).

---

## 5. Application Configuration & Local Development

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
* `VITE_ENABLE_MOCK_API`: Set to `true` to run completely offline with simulated server responses.
* `VITE_REQUIRE_AUTH_FOR_CREATE`: Set to `true` or `false` to configure whether link creation requires authenticated tokens (defaults to `false` for public try-outs).

---

## 6. Build, Testing, and Quality Control

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
