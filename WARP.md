# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Touris App Web is a Next.js 16 (App Router) frontend for managing tourism listings in Haiti. It provides separate interfaces for administrators (Ministère du Tourisme) and partners (hotels, restaurants, attractions, tour operators).

This application connects to the **listing-backend** API, which must be running locally for full functionality.

## Common Commands

### Development
```bash
# Start development server (runs on http://localhost:3001 to avoid port conflict with backend)
npm run dev -- -p 3001

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Backend Integration
The backend (listing-backend) runs on `http://localhost:3000`. The frontend is configured via `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

Always run the frontend on a different port (e.g., 3001) to avoid conflicts.

## Architecture

### Application Structure

**Two-Portal System:**
1. **Admin Portal** (`/admin/*`) - For Ministry of Tourism administrators
   - Dashboard with global statistics
   - Partner management
   - Listing validation and moderation
   - User management
   - Blue theme (blue-600 navigation)

2. **Partner Portal** (`/partner/*`) - For tourism businesses
   - Personal dashboard with listing statistics
   - Listing management (create, edit, delete)
   - Profile/establishment information
   - Green theme (green-600 navigation)

### Directory Structure

- `app/` - Next.js App Router pages and layouts
  - `admin/` - Admin portal pages with shared layout
  - `partner/` - Partner portal pages with shared layout
  - `layout.tsx` - Root layout with Geist fonts
  - `page.tsx` - Landing page with portal selection
- `lib/` - Shared utilities
  - `axios.ts` - Configured API client with JWT interceptors
- `types/` - TypeScript definitions
  - `index.ts` - Shared interfaces (User, Partner, Listing, API responses)
- `public/` - Static assets

### Key Technologies

- **Next.js 16.0.0** with App Router and React Server Components
- **React 19.2.0** with React Compiler enabled
- **TypeScript 5** with strict mode
- **Tailwind CSS 4** for styling
- **React Hook Form 7.65** + **Zod 4.1** for form validation
- **Axios** for API communication

### API Client Pattern

The `lib/axios.ts` file exports a configured Axios instance with:
- Automatic JWT token injection from localStorage
- 401 handling (automatic logout and redirect to `/login`)
- Base URL from `NEXT_PUBLIC_API_URL` environment variable

**Usage:**
```typescript
import apiClient from '@/lib/axios';

const response = await apiClient.get<ApiResponse<Listing[]>>('/listings');
```

### Type System

All shared types are defined in `types/index.ts`:
- `User` - User accounts with roles (admin, partner, user)
- `Partner` - Tourism business entities with types and status
- `Listing` - Tourism listings with location, images, and metadata
- `ApiResponse<T>` - Standard API response wrapper
- `PaginatedResponse<T>` - Paginated API responses

### Path Aliases

TypeScript is configured with `@/*` pointing to the project root:
```typescript
import apiClient from '@/lib/axios';
import { User } from '@/types';
```

## Development Guidelines

### Backend-First Development
**CRITICAL: Always verify listing-backend API structure before implementing frontend features.**

Before implementing any feature:
1. Search the listing-backend codebase for relevant routes, controllers, and models
2. Verify endpoint paths, request/response formats, and data structures
3. Match frontend types and API calls to backend implementation
4. Check authentication requirements and role-based access

The backend is the source of truth for:
- API endpoint paths and methods
- Request/response data structures
- Validation rules and constraints
- Authentication and authorization flows
- Database schema and relationships

### Next.js App Router Patterns
- Use Server Components by default
- Add `'use client'` directive only when needed (forms, interactivity, browser APIs)
- Layouts provide shared navigation and styling for route segments
- Each portal has its own layout component

### Styling Conventions
- Tailwind utility classes for all styling
- Admin portal uses blue color scheme (blue-600)
- Partner portal uses green color scheme (green-600)
- Consistent card pattern: `bg-white p-6 rounded-lg shadow`

### Form Handling
Forms should use:
- React Hook Form for form state management
- Zod for schema validation with `@hookform/resolvers`
- The API client for submission

### Authentication Flow
- JWT tokens stored in localStorage
- Token automatically added to all API requests via interceptor
- 401 responses trigger automatic logout and redirect to `/login`
- Authentication pages not yet implemented (planned feature)

## Project Status

This is an early-stage project with basic scaffolding in place. According to SETUP.md, the following are still pending:
- Missing route implementations
- JWT authentication implementation
- Form implementations with React Hook Form
- Backend API integration
- Image upload/management
- Zod validation schemas

When implementing new features, connect to the listing-backend API using the patterns established in `lib/axios.ts` and follow the type definitions in `types/index.ts`.

<citations>
<document>
    <document_type>RULE</document_type>
    <document_id>BPtWB6X8z5MfJ7CGuWLZci</document_id>
</document>
<document>
    <document_type>RULE</document_type>
    <document_id>HqOtLXv0sU4N6DJGN1xDvP</document_id>
</document>
<document>
    <document_type>RULE</document_type>
    <document_id>yb0Bt56S7mrJg8PwSgROLg</document_id>
</document>
</citations>
