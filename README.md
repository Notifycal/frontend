# frontend

A modern, type-safe React application for managing business notifications and reminders. Built with scalability, developer experience, and user experience in mind.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Building](#building)
- [Project Structure](#project-structure)
- [Important Notes](#important-notes)

## Overview

Notifycal is a comprehensive notification management platform that helps businesses set up automated reminders and notifications. The frontend provides a seamless onboarding experience, calendar integration, and business profile management.

## Features

### Core Features

- **Multi-step Onboarding Flow** - Guided setup for new businesses
- **Google OAuth Integration** - Secure authentication via Google
- **Calendar Integration** - Google Calendar connectivity for scheduling
- **Business Profile Management** - Multi-industry business setup and configuration
- **Reminder System** - Core notification and reminder functionality
- **Internationalization** - Full i18n support (English/Spanish)
- **Phone Number Validation** - International phone number support with country codes
- **Feedback System** - User feedback collection and management

### Technical Features

- **Type-safe API Layer** - Full TypeScript integration with API mocking
- **File-based Routing** - TanStack Router with automatic route generation
- **Comprehensive Error Handling** - Error boundaries and fallback components
- **Animation Support** - Smooth animations via Motion library
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Mock Service Worker** - API mocking for development and testing

## Tech Stack

### Core Framework

- **[React](https://react.dev)** - Modern React with latest features
- **[TypeScript](https://www.typescriptlang.org)** - Type safety throughout the application
- **[Vite](https://vitejs.dev)** - Fast build tool and development server

### UI & Styling

- **[Mantine](https://mantine.dev)** - Comprehensive React components library
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[Tabler Icons](https://tabler.io/icons)** - Beautiful SVG icons
- **[Motion](https://motion.dev)** - Animation library for React

### Routing & State Management

- **[TanStack Router](https://tanstack.com/router/v1)** - Type-safe routing with file-based routes
- **[TanStack Query](https://tanstack.com/query/latest)** - Server state management
- **[TanStack Table](https://tanstack.com/table/v8)** - Headless table component
- **[Zustand](https://zustand.surge.sh)** - Simple state management

### Forms & Validation

- **[React Hook Form](https://react-hook-form.com)** - Performant forms with validation
- **[Zod](https://zod.dev)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Form validation resolvers

### HTTP & API

- **[Axios](https://axios-http.com)** - HTTP client for API requests
- **[MSW](https://mswjs.io)** - Mock Service Worker for API mocking

### Internationalization

- **[react-i18next](https://react.i18next.com)** - React internationalization
- **[i18next](https://www.i18next.com)** - Internationalization framework
- **[i18next-browser-languagedetector](https://github.com/i18next/i18next-browser-languagedetector)** - Language detection
- **[i18next-http-backend](https://github.com/i18next/i18next-http-backend)** - Backend plugin for loading translations

### Testing

- **[Vitest](https://vitest.dev)** - Unit testing framework
- **[React Testing Library](https://testing-library.com)** - Component testing utilities
- **[Faker](https://fakerjs.dev/)** - Generate massive amounts of fake (but realistic) data for testing and development

### Development Tools

- **[Storybook](https://storybook.js.org)** - Component development and documentation
- **[ESLint](https://eslint.org)** - Comprehensive linting with 8 configurations
- **[Prettier](https://prettier.io)** - Code formatting

### Utility Libraries

- **[Radash](https://radash.vercel.app)** - Modern utility library
- **[Luxon](https://moment.github.io/luxon)** - Date and time handling
- **[Day.js](https://day.js.org)** - Lightweight date manipulation
- **[Clsx](https://github.com/lukeed/clsx)** - Conditional CSS classes
- **[Deepmerge-ts](https://github.com/RebeccaStevens/deepmerge-ts)** - Type-safe object merging
- **[ts-reset](https://github.com/total-typescript/ts-reset)** - Improvements for TypeScript's built-in typings

## Requirements

- **Node.js 18+** - Required for development
- **npm** - Package manager (comes with Node.js)

## Getting Started

1. **Clone the repository:**

```bash
git clone git@github.com:Notifycal/frontend.git
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Start development server:**

```bash
# Ensure your AWS_PROFILE environment variable is set, and that the chosen environment is deployed and has an API Gateway working
API_ENV=<environment-name> npm run dev:remote
```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server with local configuration
- `npm run dev:remote` - Start with remote API configuration (requires API_ENV environment variable)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests (watch mode disabled)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run prettier` - Check code formatting
- `npm run prettier:fix` - Fix code formatting
- `npm run types` - Run TypeScript check
- `npm run check` - Run all checks (types, lint, prettier, test)
- `npm run storybook` - Start Storybook development server
- `npm run storybook:build` - Build Storybook

### Development Tools

All devtools are automatically excluded from production builds. The project includes comprehensive development tools:

#### **TanStack Router DevTools** - Available in development builds

#### **TanStack Query DevTools** - Server state debugging

#### **TanStack Table DevTools** - Table debugging utilities

Documentation is, at the time of writing this, non-existent. Having said that, usage is similar to the other TanStack devtools. A utility component restricting the devtools to development builds has been provided. The difference in comparison to the other TanStack devtools is the lack of floating mode. Instead, the Devtools are rendered as a component within the actual TanStack Table you define. An additional caveat being that the DevTools component (built-in and provided utility alike) require a table prop from the `useReactTable()` hook. In other words, if you have multiple tables, each table must have its own Devtools component. Check the simplified code below.

```
function Table(): JSX.Element {
  /* some code */

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {/* table code */}
      <TanStackTableDevelopmentTools table={table} />
    </>
  )
}
```

#### **React Hook Form DevTools** - Form debugging utilities

The icon can be recognized in the top right corner of the page by the pink React Hook Form clipboard logo. A utility component has also provided. Like the TanStack Table Devtools component above, a prop must be passed from a specific hook. In this case, it is the control prop from the `useForm()` hook. Similar to TanStack Table, use of React Hook Form DevTools requires the component be added to each unique form. More information can be found in the [React Hook Form DevTools documentation](https://react-hook-form.com/dev-tools).

To reiterate, if you wish to restrict the Devtools to development builds use the provided components found at `src/components/utils/development-tools` instead of the built-in components from their respective modules.

## Testing

The project uses Vitest and React Testing Library for comprehensive testing:

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Testing Configuration

- **Framework:** Vitest with jsdom environment
- **Testing Library:** React Testing Library with jest-dom matchers
- **Mocking:** MSW for API mocking
- **Coverage:** V8 coverage provider

## Building

### Production Build

```bash
npm run build
```

### Production Deployment

The project includes Terraform configuration for infrastructure deployment. See tf/ directory for infrastructure setup.

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── ui/             # Pure UI components (Spinner, Error, etc.)
│   ├── onboarding/     # Onboarding flow components
│   ├── layout/         # Layout components
│   └── utils/          # Utility components and dev tools
├── pages/              # Main page components
├── routes/             # TanStack Router file-based routing
├── api/                # API layer with mocking support
├── hooks/              # Custom React hooks and providers
├── assets/             # Static assets and i18n translations
├── store/              # State management (Zustand stores)
├── testing/            # Testing utilities and helpers
└── styles/             # Global CSS and styling
```

## Important Notes

### 1. Faker Usage

[Faker](https://fakerjs.dev/) is included for development and testing. Due to bundle size concerns, always use localized imports:

**TO BE CONFIGURED**

```typescript
// ❌ Avoid - imports entire library (~2MB)
import { faker } from '@faker-js/faker';

// ✅ Prefer - localized import (~600KB)
import { faker } from '@faker-js/faker/locale/en';
```

**Important:** Faker should NOT be used in production builds.

### 2. Tailwind + Mantine Integration

This project uses both Tailwind CSS and Mantine. While they work well together, be aware of potential conflicts. The project is configured to handle this properly, but custom styling may require attention to specificity.

https://shenyien.hashnode.dev/using-mantine-with-tailwind

### 3. Shared Package Dependency

The project depends on `@notifycal/shared` for common types and utilities. Ensure this package is properly configured in your development environment.

### 4. Environment Configuration

The project uses a custom configuration system:

- `config/config.local.js` - Local development configuration
- `config/config.skel.js` - Configuration template
- Build process automatically handles environment-specific configs

### 5. API Mocking

MSW (Mock Service Worker) is configured for API mocking during development and testing. This allows for a consistent and predictable development experience by intercepting network requests. Mock handlers are defined in the `src/api/mocks/handlers` directory. The handler needs to be added to `src/api/mocks/handlers.ts`.

When running the development server locally, MSW intercepts requests made to the `apiUrl` defined in `config/config.local.js`. For this to work correctly, `apiUrl` must be set to the same URL as the frontend application, typically `http://localhost:5173`.

Alternatively, you can also mock external requests (to URLs that don't belong to the project, for example Google's). To mock an external URL, you define a handler with the full URL string.

**Example:** Mocking the Google GSI client script in `src/api/mocks/handlers/googleGsi.ts`:

```typescript
import { http, HttpResponse } from 'msw';

export const getGoogleGSIHandler = (): Array<HttpHandler> => [
  http.get('https://accounts.google.com/gsi/client', () => {
    // Return a mock script or an empty response
    return HttpResponse.text('// Mocked Google GSI Client Script', {
      headers: {
        'Content-Type': 'text/javascript',
      },
    });
  })
];



This handler will intercept any request to `https://accounts.google.com/gsi/client` and return a mock JavaScript response, preventing the actual script from being loaded during development or testing.
```
