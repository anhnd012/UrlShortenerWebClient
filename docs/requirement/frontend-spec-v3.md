# URL Shortener Frontend Implementation Specification

## 1. Document Purpose

This document is the single source of truth for implementing the frontend of the URL Shortener + Analytics project.

The frontend agent must read this file before making changes.

The agent must not invent product features, API fields, endpoints, or UI states that are not defined here.

The project should be implemented incrementally. Each milestone must be completed, tested, and verified before moving to the next milestone.

---

# 2. Product Overview

## 2.1 Product Name

Working name:

```text
LinkFlow
```

## 2.2 Product Goal

Build a modern SaaS-style web application that allows users to:

```text
Visit a public landing page
Understand the product value
Create a short URL from the public entry experience
Navigate to login and sign-up entry points
Log in when authentication is available
Create a short URL inside the authenticated application
Receive a generated short URL
Copy and test the short URL
View redirect status
View click analytics
Manage expiration time
```

The frontend should support the backend learning project:

```text
Spring Boot
PostgreSQL
Redis
Kafka
Java Date Time
Virtual Threads
Docker
Testing
CI/CD
```

The frontend should not expose infrastructure implementation details such as Redis, Kafka, or virtual threads directly to the user.

---

# 3. Current Backend Scope

The backend currently supports or is planned to support:

```text
POST /api/v1/urls
GET /{shortCode}
GET /api/v1/analytics/{shortCode}
```

Authentication endpoints may not exist yet.

The frontend must assume that link management APIs such as listing, deleting, disabling, editing, registering, logging in, logging out, password reset, OAuth, or SSO may not exist yet.

The agent must not implement fake backend behavior unless explicitly marked as mock-only. Public landing and authentication screens may be implemented as UI-first screens, but unavailable actions must be clearly disabled or connected only to a documented mock mode.

---

# 4. Product Principles

The frontend must follow these principles:

1. Do not clone Bitly visually.
2. Use a clean SaaS dashboard style.
3. Prefer clarity over visual decoration.
4. Use strong empty, loading, success, and error states.
5. Do not create buttons that call nonexistent backend APIs.
6. Do not hide validation errors in toast notifications.
7. Use inline validation for forms.
8. Keep the interface accessible with keyboard navigation.
9. Keep API types separate from UI types.
10. Keep server state in TanStack Query.
11. Avoid Redux unless a real global-state requirement appears.
12. Build reusable components only when reuse is real.
13. Do not over-engineer the initial MVP.
14. Every feature must be covered by acceptance criteria.
15. Every milestone must pass lint, typecheck, and tests.

---

# 5. Frontend Technology Stack

Use the following stack unless the repository already uses an equivalent library.

```text
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
React Router
TanStack Query
React Hook Form
Zod
Axios
Recharts
Lucide React
date-fns
Vitest
React Testing Library
MSW
```

Do not add another state-management library without explicit justification.

---

# 6. Frontend Architecture

Use a feature-based structure.

```text
src/
├── app/
│   ├── router.tsx
│   ├── providers.tsx
│   ├── query-client.ts
│   └── app.tsx
├── layouts/
│   └── dashboard-layout.tsx
├── pages/
│   ├── create-link-page.tsx
│   ├── created-link-page.tsx
│   ├── analytics-page.tsx
│   ├── dashboard-page.tsx
│   ├── links-page.tsx
│   ├── link-detail-page.tsx
│   ├── not-found-page.tsx
│   ├── link-expired-page.tsx
│   └── link-not-active-page.tsx
├── features/
│   ├── short-links/
│   │   ├── api/
│   │   │   ├── create-short-link.ts
│   │   │   ├── get-short-link.ts
│   │   │   └── short-link-api.types.ts
│   │   ├── components/
│   │   │   ├── create-short-link-form.tsx
│   │   │   ├── short-link-preview.tsx
│   │   │   ├── short-link-result.tsx
│   │   │   └── short-link-status-badge.tsx
│   │   ├── hooks/
│   │   │   └── use-create-short-link.ts
│   │   ├── schemas/
│   │   │   └── create-short-link.schema.ts
│   │   └── types/
│   │       └── short-link.types.ts
│   └── analytics/
│       ├── api/
│       │   ├── get-link-analytics.ts
│       │   └── analytics-api.types.ts
│       ├── components/
│       │   ├── analytics-filter-bar.tsx
│       │   ├── analytics-summary.tsx
│       │   ├── daily-clicks-chart.tsx
│       │   └── daily-clicks-table.tsx
│       ├── hooks/
│       │   └── use-link-analytics.ts
│       └── types/
│           └── analytics.types.ts
├── components/
│   ├── ui/
│   └── common/
│       ├── app-shell.tsx
│       ├── sidebar.tsx
│       ├── topbar.tsx
│       ├── page-header.tsx
│       ├── empty-state.tsx
│       ├── error-state.tsx
│       ├── loading-state.tsx
│       └── confirm-dialog.tsx
├── lib/
│   ├── api-client.ts
│   ├── env.ts
│   ├── date-time.ts
│   ├── clipboard.ts
│   └── cn.ts
├── mocks/
│   ├── browser.ts
│   ├── handlers.ts
│   └── data/
├── test/
│   ├── setup.ts
│   └── test-utils.tsx
└── styles/
    └── globals.css
```

The exact structure may be adapted to the existing repository, but the same separation of concerns must remain.

---

# 7. Routing

Use React Router.

Initial routes:

```text
/                         -> Public landing page
/login                    -> Login page
/signup                   -> Sign-up placeholder or future sign-up page
/create                   -> Authenticated Create Link page
/created                  -> Created Link Result page
/analytics                -> Analytics page
/analytics/:shortCode     -> Analytics Detail page
/not-found                -> Generic not found page
/link-expired             -> Expired link information page
/link-not-active          -> Link not active yet information page
```

Future routes:

```text
/forgot-password
/dashboard
/links
/links/:shortCode
/profile
/settings
```

Routing rules:

```text
Public landing and login routes do not use the authenticated dashboard shell.
Authenticated application routes use the dashboard shell.
If authentication is unavailable, /create and /analytics may remain accessible in development mode.
Do not invent protected-route behavior without an existing authentication abstraction.
```

Do not implement future routes until their backend APIs exist or the task explicitly requests mock-only screens.

---

# 8. Environment Configuration

Use environment variables.

```text
VITE_API_BASE_URL=http://localhost:8080
VITE_PUBLIC_SHORT_URL_BASE=http://localhost:8080
VITE_ENABLE_MOCK_API=false
```

Create a typed environment module.

Example:

```ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  publicShortUrlBase: import.meta.env.VITE_PUBLIC_SHORT_URL_BASE,
  enableMockApi: import.meta.env.VITE_ENABLE_MOCK_API === "true",
};
```

The application must fail fast with a readable error if required environment variables are missing.

---

# 9. API Client Rules

Use one configured Axios instance.

Required behavior:

```text
Base URL from environment
JSON request and response handling
Request timeout
Centralized error normalization
No UI logic inside API client
No toast invocation inside API client
```

Example normalized error shape:

```ts
export interface ApiError {
  status?: number;
  code?: string;
  message: string;
  fieldErrors?: Record<string, string>;
}
```

The API client should map backend errors into this shape.

---

# 10. Backend API Contracts

## 10.1 Create Short URL

Endpoint:

```http
POST /api/v1/urls
```

Request:

```json
{
  "longUrl": "https://example.com/products/123",
  "expiresAt": "2026-08-20T23:59:00",
  "timezone": "Asia/Ho_Chi_Minh"
}
```

Response:

```json
{
  "shortCode": "abc123",
  "shortUrl": "http://localhost:8080/abc123"
}
```

TypeScript contract:

```ts
export interface CreateShortLinkRequest {
  longUrl: string;
  expiresAt: string;
  timezone: string;
}

export interface CreateShortLinkResponse {
  shortCode: string;
  shortUrl: string;
}
```

Do not add fields not returned by the backend.

## 10.2 Redirect

Endpoint:

```http
GET /{shortCode}
```

Expected backend behavior:

```text
302 Found when link exists and is active
404 Not Found when short code does not exist
410 Gone when link is expired
403 Forbidden when validFrom is in the future
```

The frontend normally does not call this endpoint through Axios.

The user should test it by opening the short URL in a new browser tab.

## 10.3 Analytics

Endpoint:

```http
GET /api/v1/analytics/{shortCode}
```

Optional query parameters:

```text
from=YYYY-MM-DD
to=YYYY-MM-DD
timezone=IANA_TIMEZONE
```

Example:

```http
GET /api/v1/analytics/abc123?from=2026-07-01&to=2026-07-12&timezone=Asia/Ho_Chi_Minh
```

Response:

```json
{
  "shortCode": "abc123",
  "totalClicks": 120,
  "dailyClicks": [
    {
      "date": "2026-07-12",
      "clicks": 20
    }
  ]
}
```

TypeScript contract:

```ts
export interface DailyClickApiResponse {
  date: string;
  clicks: number;
}

export interface LinkAnalyticsApiResponse {
  shortCode: string;
  totalClicks: number;
  dailyClicks: DailyClickApiResponse[];
}
```

Do not invent browser, country, device, IP, referrer, or recent-event fields unless the backend API is extended.

---

# 11. Date and Time Rules

The frontend must handle date and time carefully.

Rules:

1. Display local dates in the selected timezone.
2. Send the user's selected local date-time plus timezone exactly as required by the backend contract.
3. Do not convert the request to UTC unless the backend contract changes.
4. Use IANA timezone identifiers.
5. Never use timezone abbreviations such as ICT as request values.
6. Show readable timezone labels.

Example label:

```text
Asia/Ho_Chi_Minh — GMT+7
```

Default timezone:

```text
Intl.DateTimeFormat().resolvedOptions().timeZone
```

If the browser timezone is unavailable, use:

```text
Asia/Ho_Chi_Minh
```

Supported expiration presets:

```text
7 days
30 days
Custom date and time
```

Do not add “Never” unless the backend accepts a nullable expiration.

---

# 12. Design Direction

## 12.1 Visual Style

Use:

```text
Modern SaaS
Minimal
Data-focused
Light theme first
Subtle borders
Soft shadows
Large whitespace
Clear typography
```

Avoid:

```text
Heavy gradients
Excessive glassmorphism
Large decorative illustrations
Neon colors
Overuse of animation
Cloning Bitly branding
```

## 12.2 Design Inspiration

Use only as conceptual references:

```text
Linear for navigation density
Vercel for visual simplicity
Stripe for analytics clarity
Bitly for user workflow
```

Do not copy layouts or branding exactly.

---

# 13. Design Tokens

## 13.1 Colors

```text
background:       #F8FAFC
surface:          #FFFFFF
surface-muted:    #F1F5F9

text-primary:     #0F172A
text-secondary:   #64748B
text-muted:       #94A3B8

border:           #E2E8F0
border-strong:    #CBD5E1

primary:          #4F46E5
primary-hover:    #4338CA
primary-soft:     #EEF2FF

success:          #15803D
success-soft:     #DCFCE7

warning:          #B45309
warning-soft:     #FEF3C7

danger:           #B91C1C
danger-soft:      #FEE2E2

info:             #0369A1
info-soft:        #E0F2FE
```

## 13.2 Typography

Use Inter.

```text
Page title:       28px / 34px / 600
Section title:    18px / 28px / 600
Card title:       14px / 22px / 600
Body:             14px / 22px / 400
Small text:       12px / 18px / 400
Metric value:     28px / 34px / 600
Button text:      14px / 20px / 500
```

## 13.3 Spacing

Use a 4px base system:

```text
4
8
12
16
20
24
32
40
48
64
```

## 13.4 Radius

```text
Input:      8px
Button:     8px
Card:       12px
Modal:      16px
Badge:      9999px
```

## 13.5 Shadow

Use subtle shadows only.

```css
box-shadow: 0 1px 2px rgb(15 23 42 / 0.04);
```

Prefer borders over heavy shadows.

---

# 14. Layout Rules

Desktop application shell:

```text
Sidebar: 240px
Topbar: 64px
Content max-width: 1280px
Page horizontal padding: 32px
Page vertical padding: 32px
```

Tablet:

```text
Sidebar collapses
Page horizontal padding: 24px
```

Mobile:

```text
Sidebar becomes a drawer
Page horizontal padding: 16px
Cards become single-column
Form preview moves below the form
```

Target breakpoints:

```text
375px
768px
1024px
1440px
```

---

# 15. Shared Component Inventory

Build or reuse these components:

```text
Button
IconButton
Input
Textarea
Select
DatePicker
TimePicker
TimezoneSelect
RadioGroup
Checkbox
FormField
FormMessage
Card
MetricCard
Badge
StatusBadge
DataTable
DropdownMenu
Dialog
AlertDialog
Toast
Tooltip
Skeleton
EmptyState
ErrorState
PageHeader
CopyButton
ExternalLinkButton
PublicHeader
MobilePublicMenu
HeroSection
PublicCreateLinkCard
AuthLayout
LoginForm
OAuthButton
PasswordInput
```

The agent must search the repository before creating any new primitive component.

Do not duplicate shadcn/ui primitives.

---


---

# 15A. Application Shell Enhancements

The application shell must include:

```text
Collapsible sidebar
Topbar
User account trigger
User account dropdown
Responsive mobile navigation
Persistent sidebar preference
```

The uploaded Bitly screenshot may be used only as a structural reference for avatar placement, dropdown alignment, sidebar collapse control, menu grouping, and account-information hierarchy. Do not copy Bitly branding, colors, wording, icons, promotional items, or subscription actions.

This specification has higher priority than the reference screenshot.

## 15A.1 Desktop Shell Layout

Expanded sidebar:

```text
Width: 240px
Logo and product name visible
Navigation labels visible
Footer/version text visible
Collapse control positioned near the sidebar edge
```

Collapsed sidebar:

```text
Width: 72px
Logo mark visible
Navigation icons visible
Navigation labels hidden
Footer/version text hidden
Tooltips shown on hover and keyboard focus
Expand control remains accessible
```

Topbar:

```text
Height: 64px
Sticky at the top
Subtle bottom border
User account trigger aligned to the top-right
```

The main content area must resize when the sidebar width changes. The desktop sidebar must not overlay the main content.

## 15A.2 Sidebar Collapse Behavior

Required behavior:

```text
Expanded -> click collapse control -> collapsed
Collapsed -> click expand control -> expanded
```

Persist the preference in `localStorage`.

Suggested key:

```text
linkflow.sidebar.collapsed
```

Rules:

1. Read the saved preference during application initialization.
2. Default to expanded on desktop when no preference exists.
3. Keep sidebar state in UI state, not TanStack Query.
4. Update the layout without a page reload.
5. Keep navigation fully usable while collapsed.
6. Provide tooltips and accessible names for icon-only items.
7. Preserve a clear active-route state.
8. Make the collapse control keyboard reachable.
9. Use `aria-label="Collapse sidebar"` or `aria-label="Expand sidebar"`.
10. Respect `prefers-reduced-motion`.
11. Use a subtle 150–200ms width transition.
12. Avoid large layout-shift animations.

## 15A.3 Mobile Sidebar Behavior

At mobile widths:

```text
Sidebar becomes an off-canvas drawer
Menu button appears in the topbar
Backdrop appears behind the drawer
Escape closes the drawer
Clicking the backdrop closes the drawer
Selecting a navigation item closes the drawer
Focus is trapped while the drawer is open
```

Do not use the collapsed desktop sidebar as the mobile navigation solution.

## 15A.4 Sidebar Navigation

Initial navigation:

```text
Create Link
Analytics
```

Future navigation:

```text
Dashboard
Links
Settings
```

Only show future items when their routes and features exist.

Each item must have:

```text
Icon
Visible label when expanded
Tooltip when collapsed
Active state
Keyboard focus state
```

## 15A.5 User Account Trigger

Place the account trigger in the top-right area of the topbar.

Expanded desktop trigger:

```text
Avatar
Display name
Chevron icon
```

Compact/mobile trigger:

```text
Avatar only
```

Avatar fallback:

```text
Use initials derived from the display name.
Duc Anh Nguyen -> DA
```

If no name exists, use the first character of the email.

Required accessibility:

```text
aria-haspopup="menu"
aria-expanded
Accessible name: Open user menu
```

## 15A.6 User Account Dropdown

The dropdown opens below and is right-aligned with the trigger.

Use an accessible menu primitive such as the existing shadcn/ui `DropdownMenu`.

Width guideline:

```text
280–320px
```

Required structure:

```text
Account summary
Separator
Profile
Settings
Separator
Log out
```

Account summary contains:

```text
Avatar
Display name
Email address
```

The email may truncate, but the full value must remain available through a tooltip or accessible text.

Do not add billing, upgrade, organization, subscription, support, or API-documentation actions unless those product features exist.

## 15A.7 Logout Behavior

Authentication is currently outside the initial product scope.

The agent must inspect the repository and select one mode.

### Mode A — Authentication Exists

```text
Use the existing logout abstraction
Call the existing backend logout endpoint when required
Clear authentication state and user-specific query caches
Navigate to the existing login route
Do not duplicate token-cleanup logic
```

### Mode B — Authentication Does Not Exist

```text
Render Log out as disabled
Show helper text: Authentication is not available yet
Do not invent a login route
Do not clear arbitrary localStorage values
Do not implement fake logout behavior
```

## 15A.8 Dropdown Interaction Requirements

```text
Trigger toggles the dropdown
Clicking outside closes it
Escape closes it
Arrow keys navigate items
Enter or Space activates an item
Focus returns to the trigger after closing
The dropdown does not shift page layout
```

## 15A.9 User Data Model

Use:

```ts
export interface CurrentUser {
  displayName: string;
  email: string;
  avatarUrl?: string;
}
```

Until authentication exists, use a clearly marked development placeholder in a mock/development module:

```ts
export const developmentUser: CurrentUser = {
  displayName: "SaaS User",
  email: "user@example.com",
};
```

Never hardcode a real person's email address.

## 15A.10 Recommended Components

```text
AppShell
Sidebar
SidebarCollapseButton
MobileSidebarDrawer
Topbar
UserMenu
UserAvatar
NavigationItem
```

State ownership:

```text
AppShell owns desktop collapsed state
Mobile drawer owns temporary open state
UserMenu uses the dropdown primitive's open state
```

Do not put all shell behavior into one large component.

## 15A.11 Acceptance Criteria

```text
Desktop sidebar collapses and expands.
The preference persists after refresh.
Collapsed navigation remains accessible.
Main content resizes correctly.
Mobile navigation uses an off-canvas drawer.
User menu opens from the top-right trigger.
User summary shows avatar, name, and email.
Profile and Settings appear only when corresponding routes exist.
Logout uses real authentication when available.
Logout is disabled when authentication does not exist.
Dropdown supports click-outside, Escape, and keyboard navigation.
No real personal email is hardcoded.
The shell works at 375px, 768px, 1024px, and 1440px.
```


---

# 15B. Public Landing Page

Route:

```text
/
```

## 15B.1 Goal

The public landing page is the first experience for a new visitor.

It must:

```text
Explain what LinkFlow does
Provide a fast path to shorten a URL
Provide clear Log in and Sign up actions
Establish product credibility
Remain visually distinct from the authenticated dashboard
```

The uploaded Bitly landing-page screenshot may be used only as a structural reference for:

```text
Announcement bar
Marketing navigation
Hero hierarchy
Dark hero background
Large centered headline
Embedded URL-shortening card
Login and sign-up CTA placement
```

Do not copy Bitly branding, text, colors, icons, illustrations, feature names, or exact layout.

## 15B.2 Page Structure

Recommended structure:

```text
Optional announcement bar
Public navigation header
Hero section
Embedded short-link creation card
Product benefits section
How it works section
Footer
```

The initial implementation may stop after the hero and embedded creation card if the task scope is MVP.

## 15B.3 Announcement Bar

Optional.

Example content:

```text
New: Track every click with timezone-aware analytics.
```

Requirements:

```text
Compact height
Single short message
Optional text link
Dismissible only if dismissal state is implemented properly
Do not show fake market statistics
```

## 15B.4 Public Navigation Header

Desktop content:

```text
LinkFlow logo
Product
Features
Pricing
Resources
Log in
Sign up free
```

MVP simplification:

```text
LinkFlow logo
Features
Log in
Sign up
```

Rules:

1. Only include navigation targets that have real routes or page anchors.
2. `Log in` navigates to `/login`.
3. `Sign up` navigates to `/signup` when implemented.
4. If sign-up is unavailable, show a disabled CTA or route to a clearly marked coming-soon screen.
5. Header becomes a mobile menu at narrow widths.
6. Do not use the dashboard sidebar on the public landing page.
7. Keep the header readable over the hero background.
8. Use semantic `<nav>` markup.

## 15B.5 Hero Section

Recommended content:

Headline:

```text
Build stronger connections with every link
```

Supporting text:

```text
Create short links, share them anywhere, and understand how people engage.
```

The exact wording may be refined, but must remain original.

Hero layout:

```text
Centered headline and description
Large content width
Dark or high-contrast background
Subtle decorative shapes only
Embedded creation card below the headline
```

Avoid:

```text
Copied Bitly illustrations
Fake customer logos
Fake usage statistics
Heavy animation
```

## 15B.6 Embedded Public Create-Link Card

Purpose:

```text
Allow a first-time visitor to try the primary product action immediately.
```

Required fields:

```text
Destination URL
Expiration preset
Create short link button
```

Optional tabs must not be shown unless supported.

Do not add QR Code functionality merely because it appears in the reference screenshot.

Behavior depends on product mode:

### Mode A — Anonymous Link Creation Is Supported

```text
Submit directly to POST /api/v1/urls
Show validation inline
Show loading state
Navigate to /created on success
```

### Mode B — Authentication Is Required

```text
Validate the form locally
Store the intended destination in temporary route/session state
Navigate to /login
Resume the creation flow only after real authentication exists
```

### Mode C — Authentication Requirement Is Unknown

```text
Use a product configuration flag
Default development behavior may allow direct creation
Do not pretend that authentication occurred
```

Suggested configuration:

```text
VITE_REQUIRE_AUTH_FOR_CREATE=false
```

The agent must inspect the repository and API behavior before choosing a mode.

## 15B.7 Landing Page Visual Rules

Recommended tokens:

```text
Hero background: deep navy or dark slate
Hero text: white
Embedded card: warm white or standard white
Primary CTA: existing LinkFlow primary color
Maximum hero content width: 1280px
```

The public page may use a stronger visual identity than the dashboard, but must still share typography and component tokens.

## 15B.8 Responsive Behavior

Desktop:

```text
Full navigation
Large centered hero
Creation card width between 760px and 1040px
```

Tablet:

```text
Reduced headline size
Creation card uses most of viewport width
Navigation simplifies
```

Mobile:

```text
Mobile navigation menu
Headline wraps naturally
Single-column form
Full-width CTA
No horizontal scrolling
```

## 15B.9 Landing Page Acceptance Criteria

```text
The root route shows the public landing page.
The page does not use the dashboard sidebar.
Log in navigates to /login.
Sign up behavior matches actual product capability.
The hero explains the product clearly.
The embedded form validates destination URLs.
Create behavior matches the current authentication requirement.
No unsupported QR, pricing, campaign, or custom-domain features are shown.
The page works at 375px, 768px, 1024px, and 1440px.
```

---

# 15C. Login Page

Route:

```text
/login
```

## 15C.1 Goal

Provide a clear authentication entry point while avoiding fake authentication behavior when the backend does not support it.

The uploaded Bitly login screenshot may be used only as a structural reference for:

```text
Two-column desktop layout
Form-focused left panel
Brand illustration or visual panel on the right
OAuth button grouping
Email and password hierarchy
Forgot-password placement
Primary login CTA
```

Do not copy Bitly branding, illustration, text, provider availability, or exact spacing.

## 15C.2 Desktop Layout

Use a two-column layout:

```text
Left: login form
Right: branded visual panel
```

Suggested ratio:

```text
60% form area
40% visual area
```

Alternative:

```text
50% / 50%
```

The form content should have a readable maximum width:

```text
420–480px
```

## 15C.3 Mobile Layout

At narrow widths:

```text
Hide or move the visual panel below the form
Keep the LinkFlow logo visible
Use a single-column form
Use full-width actions
Maintain generous vertical spacing
```

## 15C.4 Login Header

Show:

```text
LinkFlow logo
Log in and start sharing
Don't have an account? Sign up
```

`Sign up` behavior must match actual product capability.

## 15C.5 Authentication Options

Possible options:

```text
Continue with Google
Continue with Apple
Continue with Single Sign-On
Email and password
```

Rules:

1. Show only providers supported by the backend/auth provider.
2. Do not render working-looking OAuth buttons that do nothing.
3. Unsupported providers may be hidden.
4. In a UI-only prototype task, unsupported buttons must be visibly disabled and labeled as unavailable.
5. Do not invent OAuth URLs.
6. Do not store third-party credentials in frontend code.

## 15C.6 Email and Password Form

Fields:

```text
Email
Password
```

Email validation:

```text
Required
Trim whitespace
Valid email format
Maximum 254 characters
```

Password validation for login:

```text
Required
Do not enforce sign-up password-complexity rules during login
```

Password field behavior:

```text
Show/hide password toggle
Accessible label
Preserve value when toggled
```

Primary button:

```text
Log in
```

Loading label:

```text
Logging in...
```

## 15C.7 Forgot Password

Show only when a real route or backend flow exists.

Future route:

```text
/forgot-password
```

When unavailable:

```text
Hide the link
or
Show disabled text with "Not available yet"
```

Do not route to a nonexistent page.

## 15C.8 Login Behavior

The agent must inspect the repository and choose one mode.

### Mode A — Authentication Exists

```text
Call the documented login API or auth SDK
Use the existing auth abstraction
Store session/token only through the existing secure mechanism
Never log credentials
Invalidate or initialize current-user queries
Redirect to the intended route or /create
Show normalized API errors
```

### Mode B — Authentication Does Not Exist

```text
Implement the complete UI and client-side validation
Disable final submission
Show: Authentication backend is not available yet
Do not accept arbitrary credentials
Do not create a fake authenticated session
Do not write fake tokens to localStorage
```

### Mode C — Explicit Mock Authentication

Allowed only when the task explicitly requests mock mode.

```text
Gate mock auth behind VITE_ENABLE_MOCK_AUTH=true
Use clearly documented development-only credentials
Never enable mock auth in production builds
Keep mock implementation isolated
```

## 15C.9 Login Error States

Examples:

```text
Invalid email or password.
Your session could not be created.
Could not connect to the authentication service.
Too many attempts. Try again later.
```

Rules:

```text
Do not reveal whether a particular email exists.
Do not show backend stack traces.
Keep field errors inline.
Show general authentication errors near the submit button or form heading.
```

## 15C.10 Security Requirements

```text
Never persist raw passwords
Never log passwords
Do not put credentials in URLs
Use HTTPS in deployed environments
Use secure, existing token/session storage strategy
Do not invent localStorage token storage without backend/security design
Clear sensitive form state after successful login
```

## 15C.11 Right-Side Visual Panel

Purpose:

```text
Provide product identity and balance the desktop layout.
```

Allowed content:

```text
Original LinkFlow illustration
Abstract link/network graphic
Short product statement
Simple feature highlights
```

Do not copy the uploaded Bitly illustration.

When no original asset exists:

```text
Use a CSS-based abstract visual
or
Use a neutral gradient/shape composition
```

Do not block implementation on custom illustration work.

## 15C.12 Login Accessibility

```text
Use a real form element
Associate labels with inputs
Support Enter to submit
Provide visible focus states
Expose validation through aria-describedby
Make password visibility toggle accessible
Keep disabled provider buttons understandable
Ensure tab order matches visual order
```

## 15C.13 Login Acceptance Criteria

```text
/login renders outside the dashboard shell.
Desktop uses a balanced two-column layout.
Mobile uses a single-column layout.
Email and password validation works.
Password show/hide works.
Only supported authentication providers are active.
Login behavior matches actual backend capability.
No fake token or fake authenticated session is created.
Errors are readable and secure.
The page works at 375px, 768px, 1024px, and 1440px.
```

---

# 15D. Public and Authenticated Layout Separation

Use separate layouts:

```text
PublicLayout
AuthLayout
DashboardLayout
```

Recommended mapping:

```text
PublicLayout:
- /
- optional marketing pages

AuthLayout:
- /login
- /signup
- /forgot-password

DashboardLayout:
- /create
- /created
- /analytics
- /analytics/:shortCode
- future dashboard routes
```

Requirements:

1. Do not put the dashboard sidebar on landing or login pages.
2. Reuse design tokens and primitive components across layouts.
3. Keep navigation behavior appropriate to each context.
4. Avoid one giant layout component with route-specific conditional branches.
5. Route-level code splitting is recommended for marketing, auth, and dashboard bundles.

# 16. Page 1 — Create Short Link

Route:

```text
/create
```

## 16.1 Goal

Allow the user to create a short URL using the backend API.

## 16.2 Desktop Layout

Use a two-column layout.

```text
Left column:
Create form

Right column:
Live preview
```

Suggested width ratio:

```text
60% form
40% preview
```

Mobile layout:

```text
Form first
Preview below form
```

## 16.3 Page Header

Title:

```text
Create a short link
```

Description:

```text
Turn a long destination URL into a shareable short link.
```

## 16.4 Form Fields

### Destination URL

Label:

```text
Destination URL
```

Placeholder:

```text
https://example.com/products/123
```

Validation:

```text
Required
Maximum 2048 characters
Must be a valid URL
Allow user to omit protocol
Normalize missing protocol to https://
Reject localhost
Reject 127.0.0.1
Reject private IPv4 ranges:
10.0.0.0/8
172.16.0.0/12
192.168.0.0/16
```

Inline error examples:

```text
Enter a destination URL.
Enter a valid URL.
Private or local network addresses are not allowed.
The URL must not exceed 2048 characters.
```

### Expiration

Label:

```text
Expiration
```

Options:

```text
7 days
30 days
Custom date and time
```

Default:

```text
30 days
```

For preset expiration, calculate based on current local date and timezone.

For custom expiration, show:

```text
Date
Time
Timezone
```

Validation:

```text
Expiration must be in the future.
Expiration must be a valid date and time.
Timezone must be a valid IANA timezone.
```

### Timezone

Default:

```text
Browser timezone
```

Fallback:

```text
Asia/Ho_Chi_Minh
```

Display:

```text
Asia/Ho_Chi_Minh — GMT+7
```

Request value:

```text
Asia/Ho_Chi_Minh
```

## 16.5 Form Submission

Submit button text:

```text
Create short link
```

Loading text:

```text
Creating link...
```

During submission:

```text
Disable the submit button
Prevent duplicate submission
Keep the current form values
Show loading indicator
```

## 16.6 Success Behavior

After successful creation:

1. Store response in route state or component state.
2. Navigate to `/created`.
3. Show generated short URL.
4. Show copy action.
5. Show open-in-new-tab action.
6. Show create-another-link action.
7. Do not auto-open the redirect.

## 16.7 API Error Handling

Possible UI messages:

```text
400:
Please review the form and try again.

409:
This short code already exists. Please try again.

500:
The server could not create the link. Try again later.

Network error:
Could not connect to the server.
```

If backend returns field errors, map them to form fields.

## 16.8 Live Preview Card

Show:

```text
Short link preview
Generated after submission
Destination URL
Expiration
Timezone
Status: Active
```

Before submission:

```text
The short link will appear here after creation.
```

The preview must not generate a fake short code.

## 16.9 Loading, Empty, Error, Success States

The page must explicitly support:

```text
Idle
Validating
Submitting
Success
Validation error
API error
```

## 16.10 Acceptance Criteria

```text
User can enter a destination URL.
Missing protocol is normalized to https://.
Invalid URLs show inline validation.
Private and local URLs are rejected.
User can choose 7 days, 30 days, or custom expiration.
Timezone defaults correctly.
Submit calls POST /api/v1/urls.
Duplicate submission is prevented.
Successful creation navigates to /created.
API errors are readable.
The page works at 375px and 1440px widths.
Keyboard-only usage is possible.
```

---

# 17. Page 2 — Created Link Result

Route:

```text
/created
```

## 17.1 Goal

Clearly communicate that the short link was created and allow immediate use.

## 17.2 Layout

Centered result card.

Content:

```text
Success icon
Your short link is ready
Generated short URL
Copy button
Open link button
Destination URL
Expiration summary
Create another link button
View analytics button
```

## 17.3 Copy Behavior

On copy success:

```text
Button label temporarily changes to “Copied”
Show a non-blocking toast
Restore original label after a short delay
```

On failure:

```text
Show “Could not copy the link”
Keep the URL selectable
```

## 17.4 Open Link Behavior

Use:

```html
target="_blank"
rel="noopener noreferrer"
```

## 17.5 Route Guard

If the page is opened directly without a created-link result:

```text
Show a message:
No recently created link was found.

CTA:
Create a short link
```

Do not crash.

## 17.6 Acceptance Criteria

```text
Generated short URL is visible.
User can copy the URL.
User can open the URL in a new tab.
Destination URL is visible.
Direct page access without state is handled.
The page is responsive and keyboard accessible.
```

---

# 18. Page 3 — Analytics

Routes:

```text
/analytics
/analytics/:shortCode
```

## 18.1 Analytics Search Page

If no short code is in the route:

Show a form:

```text
Short code
From date
To date
Timezone
View analytics
```

Short code validation:

```text
Required
Trim whitespace
Maximum 20 characters
Only characters accepted by the backend short-code rules
```

On submit:

```text
Navigate to /analytics/{shortCode}
Preserve query parameters
```

## 18.2 Analytics Detail Page

Header:

```text
Analytics
Performance for /{shortCode}
```

Filter bar:

```text
Date range
Timezone
Apply filters
Reset filters
```

Default date range:

```text
Last 7 days
```

Default timezone:

```text
Browser timezone
```

## 18.3 Summary Cards

Show only metrics that can be derived from the API.

Required:

```text
Total clicks
Average clicks per day
Highest-click day
Date range
```

Derived calculations:

```text
averageClicksPerDay = totalClicks / numberOfDaysInReturnedRange
highestClickDay = dailyClicks item with maximum clicks
```

Handle empty arrays safely.

## 18.4 Chart

Use Recharts.

Preferred chart:

```text
Line chart
```

X-axis:

```text
Date
```

Y-axis:

```text
Clicks
```

Required states:

```text
Loading skeleton
No data
API error
Success
```

Chart accessibility:

```text
Provide a textual summary.
Provide a daily clicks table below or near the chart.
Do not rely on the chart alone.
```

## 18.5 Daily Clicks Table

Columns:

```text
Date
Clicks
Percentage of total
```

Sort:

```text
Most recent date first
```

## 18.6 Error Handling

Possible cases:

```text
404:
No analytics were found for this short code.

400:
The selected date range is invalid.

500:
Analytics could not be loaded.

Network:
Could not connect to the server.
```

## 18.7 Empty State

When total clicks are zero:

```text
No clicks yet
Share the short link to start collecting analytics.
```

Do not render misleading charts.

## 18.8 Acceptance Criteria

```text
User can enter a short code.
User can choose a date range.
User can choose a timezone.
The frontend calls the analytics endpoint with correct query parameters.
Total clicks is displayed.
Average clicks per day is calculated correctly.
Highest-click day is calculated correctly.
Daily clicks are rendered in a chart.
Daily clicks are also available as text or table.
Loading, empty, and error states are implemented.
```

---

# 19. Redirect Error Pages

These pages are informational UI screens.

## 19.1 Link Not Found

Title:

```text
Link not found
```

Message:

```text
The short link may be incorrect or no longer exists.
```

CTA:

```text
Create a new short link
```

## 19.2 Link Expired

Title:

```text
This link has expired
```

Message:

```text
The owner configured this link to expire.
```

If expiration is known:

```text
Expired on {formattedDate}.
```

## 19.3 Link Not Active Yet

Title:

```text
This link is not active yet
```

Message:

```text
This short link has not reached its activation time.
```

If activation is known:

```text
Available from {formattedDate}.
```

Do not assume the backend redirects to these SPA routes unless the backend is configured to do so.

---

# 20. Future Management Screens

Do not implement these screens until required APIs exist.

## 20.1 Future Required APIs

```http
GET /api/v1/urls
GET /api/v1/urls/{shortCode}
PATCH /api/v1/urls/{shortCode}/status
DELETE /api/v1/urls/{shortCode}
```

## 20.2 Future Screens

```text
Dashboard
Links list
Link detail
Settings
```

## 20.3 Future Dashboard Metrics

Only implement after backend support:

```text
Total links
Active links
Expired links
Total clicks
Top links
Recent links
Expiring soon
```

---

# 21. Form Validation Rules

Use Zod.

Validation must exist in both:

```text
Schema
UI messages
```

The frontend validation is for user experience only.

The backend remains the source of truth.

Do not remove backend validation handling because frontend validation exists.

---

# 22. Accessibility Requirements

Minimum requirements:

```text
Semantic HTML
Visible labels
Keyboard navigation
Visible focus states
ARIA labels for icon-only buttons
Sufficient color contrast
Error messages linked to form fields
Dialogs trap focus
Escape closes dismissible dialogs
Charts have textual equivalents
Status is not communicated by color alone
```

Every icon-only action must have an accessible name.

Example:

```html
<button aria-label="Copy short link">
```

---

# 23. Responsive Requirements

The frontend must be verified at:

```text
375px
768px
1024px
1440px
```

Mobile rules:

```text
No horizontal page scrolling
Form controls use full width
Buttons may stack vertically
Preview card moves below the form
Chart remains readable
Tables may become cards or scroll within their container
```

Do not hide important data on mobile without an alternative presentation.

---

# 24. Loading State Rules

Use skeletons for:

```text
Analytics cards
Analytics chart
Analytics table
Future dashboard cards
Future link tables
```

Use button-level loading for mutations.

Avoid full-page spinners unless the entire application is bootstrapping.

---

# 25. Empty State Rules

Every data-driven screen must have an explicit empty state.

Required empty states:

```text
No recently created link
No analytics found
No clicks yet
Future: no links created
Future: no search results
```

Each empty state should contain:

```text
Title
Short explanation
Relevant action
```

---

# 26. Error State Rules

Do not show raw backend stack traces.

Error UI should contain:

```text
Human-readable title
Human-readable description
Retry action when applicable
Navigation action when retry is not applicable
```

Log technical details only in development.

---

# 27. Toast Rules

Use toast for transient feedback only:

```text
Copied
Copy failed
Saved
Retry succeeded
```

Do not use toast as the only location for:

```text
Form validation
Critical API errors
Destructive confirmation
```

---

# 28. Query Management

Use TanStack Query.

Suggested query keys:

```ts
["short-links"]
["short-link", shortCode]
["analytics", shortCode, from, to, timezone]
```

Suggested mutation key:

```ts
["create-short-link"]
```

Do not manually duplicate server data into local state without a reason.

---

# 29. Testing Strategy

## 29.1 Unit Tests

Test:

```text
URL normalization
Private URL rejection
Expiration calculation
Timezone fallback
Analytics derived metrics
Clipboard helper
Error normalization
```

## 29.2 Component Tests

Test:

```text
Create form validation
Create form submission
Disabled submit while pending
API error display
Created result copy action
Direct access to /created
Analytics loading state
Analytics empty state
Analytics error state
Analytics success rendering
Sidebar collapse and expand behavior
Sidebar preference restoration
Mobile drawer open and close behavior
User dropdown keyboard interaction
Logout disabled state when authentication is absent
Landing page navigation
Public create-link form behavior
Login email validation
Password visibility toggle
Login disabled state when authentication is absent
Unsupported OAuth provider behavior
```

## 29.3 Integration Tests

Use MSW.

Cover:

```text
Successful create URL flow
Create URL validation failure
Create URL API failure
Successful analytics flow
Analytics not found
Analytics server failure
Public landing create-link flow
Landing-to-login navigation
Login API success when authentication exists
Login API failure when authentication exists
Unavailable-auth login behavior
```

## 29.4 End-to-End Tests

Optional initially.

Recommended later:

```text
Playwright
```

Critical flows:

```text
Create link
Copy link
Open redirect
Search analytics
Change date range
```

---

# 30. Definition of Done

A task is done only when:

```text
Acceptance criteria are satisfied.
The implementation matches this specification.
No unsupported API fields are invented.
Loading state exists.
Empty state exists where relevant.
Error state exists.
Responsive behavior is verified.
Accessibility basics are satisfied.
TypeScript has no errors.
Lint passes.
Tests pass.
No duplicate primitive component was created.
No console error exists in normal usage.
```

Required commands:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If the project uses different scripts, run the closest equivalents.

---

# 31. Implementation Milestones

## Milestone 1 — Foundation

Scope:

```text
Initialize React + TypeScript + Vite
Configure Tailwind
Configure shadcn/ui
Configure React Router
Configure TanStack Query
Configure Axios client
Configure environment module
Configure testing
Create PublicLayout
Create AuthLayout
Create DashboardLayout
Create app shell
Create collapsible desktop sidebar
Create mobile sidebar drawer
Create user account dropdown
Persist sidebar preference
```

Deliverables:

```text
Application starts
Routes work
Environment is validated
Global error handling exists
Sidebar collapse and persistence work
Mobile drawer behavior works
User dropdown keyboard interaction works
Logout behavior matches current authentication capability
Lint, typecheck, test, and build pass
```

## Milestone 1A — Public Landing Page

Scope:

```text
Public navigation
Responsive mobile navigation
Hero section
Original LinkFlow marketing copy
Embedded create-link card
Login and sign-up entry points
Authentication-requirement handling
```

Deliverables:

```text
/ route renders the public landing page
No dashboard sidebar is present
Embedded create flow follows current backend/auth capability
Responsive states are verified
```

## Milestone 1B — Login UI

Scope:

```text
Auth layout
Login form
Email validation
Password visibility toggle
Supported provider buttons only
Authentication capability detection
Secure error states
Responsive visual panel
```

Deliverables:

```text
/login renders correctly
No fake authentication is introduced
Unsupported auth actions are disabled or hidden
Tests cover validation and unavailable-auth behavior
```

## Milestone 2 — Create Link

Scope:

```text
Create Link page
Zod validation
URL normalization
Expiration presets
Custom expiration
Timezone selection
POST /api/v1/urls
Loading and error states
```

Deliverables:

```text
Create URL flow works against mock API
Create URL flow works against real backend
Tests cover success and failure
```

## Milestone 3 — Created Result

Scope:

```text
Created Link Result page
Copy action
Open action
Route-state guard
Create another link
Analytics navigation
```

## Milestone 4 — Analytics

Scope:

```text
Analytics search page
Analytics detail page
Date filters
Timezone filter
Summary cards
Line chart
Daily clicks table
Loading, empty, and error states
```

## Milestone 5 — Polish

Scope:

```text
Responsive refinement
Accessibility review
Focus states
Keyboard navigation
Error message consistency
Visual consistency
Test coverage improvements
```

Do not start future management screens until the backend exposes the required APIs.

---

# 32. Agent Execution Rules

The coding agent must follow this process:

1. Read this document completely.
2. Inspect the current repository.
3. Identify existing components and conventions.
4. Produce a short implementation plan.
5. Implement only the requested milestone.
6. Do not modify unrelated backend code.
7. Do not invent APIs.
8. Add or update tests.
9. Run lint, typecheck, tests, and build.
10. Report:
   - files changed
   - decisions made
   - tests run
   - remaining risks
   - backend contract mismatches

The agent must stop and report a mismatch when the actual backend contract conflicts with this document.

---

# 33. Prompt Template for Coding Agent

Use this prompt when assigning a milestone:

```text
You are implementing the frontend of the URL Shortener project.

First read:
- docs/frontend-spec.md
- existing repository conventions
- existing API contracts

Implement only Milestone [NUMBER] from docs/frontend-spec.md.

Requirements:
- Follow the architecture and design rules in the specification.
- Do not invent backend endpoints or response fields.
- Reuse existing UI primitives.
- Implement loading, empty, error, and success states where applicable.
- Add tests.
- Run lint, typecheck, tests, and build.
- Do not change unrelated files.

Before coding:
1. Inspect the repository.
2. Summarize the implementation plan.
3. Identify contract mismatches or missing dependencies.

After coding:
1. List changed files.
2. Explain important decisions.
3. Report commands executed and results.
4. Report remaining risks or incomplete backend dependencies.
```

---

# 34. Milestone-Specific Agent Prompts

## Milestone 1 Prompt

```text
Implement Milestone 1 — Foundation from docs/frontend-spec.md.

Create the frontend foundation using:
React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router,
TanStack Query, Axios, Vitest, React Testing Library, and MSW.

Do not implement product pages beyond basic route placeholders.

Required output:
- working app shell
- router
- providers
- typed environment module
- Axios API client
- test setup
- lint/typecheck/test/build success
```

## Public Landing Page Prompt

```text
Implement Milestone 1A — Public Landing Page from docs/frontend-spec.md.

Use the uploaded Bitly landing screenshot only as structural inspiration.

Build:
- PublicLayout
- responsive public header
- original LinkFlow hero copy
- embedded create-link card
- Log in navigation to /login
- Sign up behavior based on actual product capability
- create-link behavior based on current authentication requirement
- loading, validation, and error states

Do not:
- copy Bitly branding or text
- add QR Code functionality
- add fake pricing, campaigns, or custom domains
- invent authentication behavior

Add tests and verify at 375px, 768px, 1024px, and 1440px.
Run lint, typecheck, tests, and build.
```

## Login UI Prompt

```text
Implement Milestone 1B — Login UI from docs/frontend-spec.md.

Use the uploaded Bitly login screenshot only as structural inspiration.

Build:
- AuthLayout
- /login route
- two-column desktop layout
- single-column mobile layout
- email field
- password field with visibility toggle
- supported OAuth/SSO buttons only
- sign-up and forgot-password behavior based on available routes
- loading, validation, and secure error states

Before implementation:
- inspect the repository for authentication APIs, SDKs, route guards, and token/session handling
- choose the correct authentication mode defined in the specification

Do not:
- create fake tokens
- create a fake authenticated session
- store passwords
- invent OAuth URLs
- hardcode real personal data

Add tests and verify at 375px, 768px, 1024px, and 1440px.
Run lint, typecheck, tests, and build.
```

## Application Shell Enhancement Prompt

```text
Update the application shell according to section 15A of docs/frontend-spec.md.

Implement:
- collapsible desktop sidebar
- persistent sidebar preference
- accessible tooltips for collapsed navigation
- mobile off-canvas navigation drawer
- top-right user account trigger
- accessible user dropdown
- account summary
- Profile and Settings only when corresponding routes exist
- Logout according to the current authentication capability

Important:
- inspect the repository before deciding logout behavior
- do not invent authentication
- do not hardcode a real person's email
- reuse existing shadcn/ui primitives
- add component tests
- verify at 375px, 768px, 1024px, and 1440px
- run lint, typecheck, tests, and build
```

## Milestone 2 Prompt

```text
Implement Milestone 2 — Create Link from docs/frontend-spec.md.

Build:
- /create page
- destination URL validation and normalization
- expiration presets
- custom expiration date and time
- timezone selector
- POST /api/v1/urls integration
- inline validation
- loading and API error states
- responsive preview card

Use React Hook Form, Zod, TanStack Query, and existing UI primitives.

Do not generate a fake short code before the backend returns one.
```

## Milestone 3 Prompt

```text
Implement Milestone 3 — Created Result from docs/frontend-spec.md.

Build:
- /created page
- generated short URL display
- copy action
- open-in-new-tab action
- create-another-link action
- analytics navigation
- direct-access fallback when route state is missing

Add component tests for copy success, copy failure, and missing route state.
```

## Milestone 4 Prompt

```text
Implement Milestone 4 — Analytics from docs/frontend-spec.md.

Build:
- /analytics search page
- /analytics/:shortCode detail page
- date-range filter
- timezone filter
- GET /api/v1/analytics/{shortCode}
- total clicks
- average clicks per day
- highest-click day
- daily clicks line chart
- accessible daily clicks table
- loading, empty, error, and success states

Do not add country, browser, device, IP, referrer, or recent-event UI.
```

## Milestone 5 Prompt

```text
Implement Milestone 5 — Polish from docs/frontend-spec.md.

Review and improve:
- responsive behavior at 375px, 768px, 1024px, and 1440px
- keyboard navigation
- focus styles
- semantic HTML
- ARIA labels
- color contrast
- error message consistency
- loading and empty states
- test coverage
- lint/typecheck/test/build status

Do not add new product features.
```

---

# 35. Non-Goals

The following are outside the initial scope unless separately specified:

```text
Production authentication backend
Account registration backend
OAuth provider integration
Password-reset backend
Teams
Organizations
Billing
Custom domains
QR codes
Editable short codes
Bulk URL creation
UTM builder
Browser extensions
Public profile pages
Country analytics
Device analytics
Browser analytics
Referrer analytics
Real-time click stream
Role-based access control
Dark mode
Internationalization
```

These may be added later through separate specifications.

---

# 36. Final Instruction to Agent

Build the smallest production-quality frontend that correctly supports the current backend.

Prioritize:

```text
Correctness
Clear API contracts
User feedback
Testing
Accessibility
Responsive behavior
Maintainable architecture
```

Do not prioritize:

```text
Feature count
Decorative complexity
Premature abstraction
Unsupported backend behavior
```
