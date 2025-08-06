# Overview

This is a CNS (Central Nervous System) Study Planner application designed to help medical students organize and track their study materials. The application provides a comprehensive platform for managing PDF study guides, educational videos, study schedules, bookmarks, and personal notes. It features a modern React frontend with a clean, medical-themed UI and an Express.js backend with PostgreSQL database integration.

The application is structured as a full-stack web application with separate client and server directories, using modern TypeScript throughout. It includes features like PDF upload and viewing, video resource management, progress tracking, scheduling, and note-taking capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for the user interface
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight React Router alternative)
- **TanStack Query** for server state management and API data fetching
- **Tailwind CSS** with **Shadcn/ui** component library for styling
- **Radix UI** primitives for accessible, unstyled UI components

The frontend follows a page-based architecture with components organized into:
- Pages for main application routes (dashboard, study-guides, videos, etc.)
- Reusable UI components built on Radix primitives
- Custom components for domain-specific functionality (PDF viewer, progress tracking)

## Backend Architecture
- **Express.js** server with TypeScript
- **RESTful API** design with route-based organization
- **Storage abstraction layer** for data access operations
- **Multer** for handling PDF file uploads with validation
- Custom middleware for request logging and error handling

The backend uses a modular approach with:
- Route handlers in `server/routes.ts`
- Storage interface abstraction in `server/storage.ts`
- Vite integration for development mode

## Database and Schema Design
- **PostgreSQL** database with **Neon Database** as the cloud provider
- **Drizzle ORM** for type-safe database operations
- **Drizzle Kit** for database migrations and schema management

The schema includes six main entities:
- **Topics**: Core subject areas with progress tracking
- **Study Guides**: PDF documents linked to topics
- **Videos**: Educational video resources with metadata
- **Schedule Items**: Time-based study planning
- **Bookmarks**: Saved references to various content types
- **Notes**: Personal study notes with topic associations

Each entity uses UUID primary keys and includes appropriate foreign key relationships and timestamps.

## Authentication and State Management
- Currently uses a minimal authentication approach (no complex auth system implemented)
- TanStack Query handles client-side state management and caching
- Form validation using React Hook Form with Zod schemas

## File Upload and Storage
- PDF uploads handled through Multer middleware
- File validation restricts uploads to PDF format only (10MB limit)
- Upload directory configured in server settings
- File metadata stored in database with physical file references

## Development and Build Process
- **TypeScript** configuration shared across client/server
- **ESBuild** for server bundling in production
- **Vite** for client bundling and development
- Path aliases configured for clean imports (`@/`, `@shared/`)

The project uses ES modules throughout and includes development-specific tooling for Replit integration.

# External Dependencies

## Database Services
- **Neon Database (@neondatabase/serverless)**: PostgreSQL cloud database provider
- **Drizzle ORM**: Type-safe database operations and migrations

## UI and Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography

## Data Management
- **TanStack Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation for forms and API data

## Development Tools
- **Vite**: Frontend build tool and development server
- **TypeScript**: Type safety across the entire application
- **PostCSS with Autoprefixer**: CSS processing

## File Handling
- **Multer**: Multipart form data parsing for file uploads

## Routing and Navigation
- **Wouter**: Lightweight client-side routing for React

The application architecture emphasizes type safety, developer experience, and modern web development practices while maintaining a clean separation of concerns between frontend and backend systems.