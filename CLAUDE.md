# Bakery Store

Full-stack bakery management app: a Spring Boot REST API (`bakery-service`) and a React SPA (`bakery-ui`).

## Local Development

### Test Login

Use these credentials to log in to the app when running/testing locally (e.g. via the Login page or browser automation):

- **Username/email:** `nntan041299@gmail.com`
- **Password:** `123123123`

## Repository Layout

```
bakery-store/
├── bakery-service/   # Spring Boot backend (Java 25)
└── bakery-ui/        # React + Vite frontend (TypeScript)
```

---

## Backend — `bakery-service`

### Technology Stack

- **Java 25**, **Spring Boot 4.0.0** (`spring-boot-starter-web`)
- **Spring Data JPA** + **PostgreSQL** for persistence
- **Flyway** for database migrations
- **Spring Security** + **JWT** (`jjwt`) for authentication/authorization
- **Spring Cloud OpenFeign** for outbound HTTP clients (e.g. Google OAuth2)
- **Lombok** for boilerplate reduction
- **MapStruct** for entity ↔ DTO mapping
- Build tool: **Maven** (`pom.xml`)

### Code Structure

Package root: `com.nntan041299.bakeryservice`, organized **by domain feature**, each with its own layered slices:

```
auth/            # Users, login/signup, JWT issuing, Google OAuth2
├── client/          Feign clients (Google APIs)
├── controller/       AuthController, UserController, GoogleAuthenticationController
├── dto/               Request/response payloads
├── entity/            User, Role
├── mapper/            UserMapper (MapStruct)
├── repository/        UserRepository
└── service/           Auth services (+ impl/ for implementations)

product/         # Product catalog (CRUD, search/filter, quantity)
├── controller/, dto/, entity/, exception/, mapper/, repository/, service/

category/        # Product categories
├── controller/, dto/, entity/, repository/, service/

security/        # Cross-cutting security: JwtUtil, JwtAuthFilter, SecurityConfig,
                 # ApplicationConfig, TokenBlacklistService, entry points/handlers

common/          # Shared infrastructure
├── advice/           Global exception handling (@ControllerAdvice)
├── config/            App-wide Spring configuration
├── controller/        Shared/base controller behavior
├── dto/               Shared DTOs (e.g. paged/standard API response)
├── entity/            Shared base entities (e.g. auditing fields)
├── exception/         Common exception types
└── filter/            Servlet filters
```

Each feature package follows the same **controller → service → repository** layering, with `entity/` for JPA entities, `dto/` for API contracts, and `mapper/` where MapStruct is used to convert between them.

Database migrations live in `bakery-service/src/main/resources/db/migration/bakery/`, versioned as `V<version>__<description>.sql` (Flyway).

### Configuration

`src/main/resources/application.yml` — server runs under context path `/bakery-service/api` on port `8080` by default. Key externalized settings (via env vars): DB connection, JWT secret/expiration, allowed CORS origin, Google OAuth2 credentials, token blacklist cleanup interval.

---

## Frontend — `bakery-ui`

### Technology Stack

- **React 18** + **TypeScript**, bundled with **Vite**
- **React Router v6** for routing
- **Redux Toolkit** + **react-redux** for global state (current user session)
- **TanStack React Query** (`@tanstack/react-query`) for all server-state (data fetching/mutations)
- **Axios** for HTTP requests
- **Tailwind CSS v4** (via `@tailwindcss/postcss`) for styling, with hand-written CSS for auth screens (`src/styles/`)
- **PrimeIcons** + **react-icons** for iconography
- **ESLint** + **Prettier** for linting/formatting; **Husky** for git hooks

Path alias: `@/*` → `src/*` (configured in `tsconfig.json` and `vite.config.js`).

### Code Structure

```
src/
├── pages/            Route-level screens only (composition of components/hooks)
│   ├── Home/              Dashboard (role-based: ShopOwnerDashboard / CustomerDashboard)
│   ├── Products/           Inventory list (index.tsx) + ProductForm (create/edit)
│   ├── Account/            Profile + change password
│   ├── Login/, SignUp/     Auth screens
│   ├── GoogleOauthCallBack/ OAuth2 redirect handler
│   └── NotFound/
│
├── components/       Reusable, presentational UI components (one folder per component,
│                     `index.tsx` entry point). No direct data fetching — driven by props.
│   e.g. Header, SideBar, Loading, PageLoader, Dropdown, CategoryPicker, CategoryFilter,
│         StatusBadge, StatCard, SortableHeader, Form/ (SectionCard, Field, Input, Textarea)
│
├── hook/             All React Query hooks (queries + mutations) and other reusable
│                     hooks (useClickOutside, etc.). Pages/components call these —
│                     never `useQuery`/`useMutation` directly outside `hook/`.
│
├── service/          Thin API layer per domain (auth, user, product, category).
│                     Wraps `rest/request` + `rest/endpoint`, exposes typed functions
│                     and TS interfaces for API payloads.
│
├── rest/             Axios instance/request wrapper (`request.ts`) and endpoint
│                     path constants (`endpoint.ts`).
│
├── constant/         Centralized constants: query keys (`queryKeys.ts`) and all
│                     user-facing copy per domain (`products.ts`, `account.ts`,
│                     `home.ts`, `sidebar.ts`, `common.ts`). No hardcoded UI strings
│                     in components/pages.
│
├── redux/            Redux Toolkit store; `user/` slice holds the authenticated
│                     user's session info (role, name, avatar, etc.).
│
├── context/           AuthProvider — token storage/refresh, auth state via React Context.
├── router/            AppRouter (authenticated routes) / AuthRouter (public routes), routes.tsx.
├── layouts/            Page shell (Layout: SideBar + Header + content).
├── config/             Environment/API base URL config.
└── styles/             Global CSS + Tailwind entry + component-specific CSS (auth, forms).
```

### Conventions

- **Data fetching**: always via a hook in `src/hook/`, built on React Query — pages/components stay declarative.
- **Strings**: user-facing text lives in `src/constant/`, not inline in JSX.
- **Shared UI logic** (e.g. click-outside detection) belongs in `src/hook/`, not duplicated per component.
- **Components vs. pages**: anything reusable or presentational goes in `src/components/`; `src/pages/` only composes them into a route.
