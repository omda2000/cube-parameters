# Architecture Overview

## Overview

This is a full-stack 3D model viewer application built with React frontend and Express backend. The application specializes in architectural model visualization with features for uploading, viewing, and manipulating 3D models (primarily FBX format), along with comprehensive lighting, material, and environment controls.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **3D Rendering**: Three.js for WebGL-based 3D graphics
- **State Management**: Zustand for global state management
- **Routing**: React Router for client-side navigation
- **Query Management**: TanStack Query for server state management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store
- **Build**: ESBuild for production compilation

### Monorepo Structure
The application follows a monorepo pattern with shared code:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript types and database schema

## Key Components

### 3D Visualization Engine
- **Three.js Integration**: Custom hooks for scene management, camera controls, and rendering
- **Model Loading**: FBX loader with caching and error handling
- **Lighting System**: Dynamic sunlight and ambient lighting with shadow quality controls
- **Material System**: Shader management and material property controls
- **Camera System**: Switchable perspective/orthographic cameras with orbit controls

### User Interface Components
- **Control Panels**: Tabbed interface for scene, lighting, materials, and environment controls
- **Tool System**: Selection, point creation, measurement, and transform tools
- **Responsive Design**: Mobile-first approach with collapsible panels
- **Notification System**: Toast notifications and message management

### State Management
- **App State**: Scene initialization and 3D context management
- **Scene State**: Model data, lighting settings, and environment configuration
- **UI State**: Panel visibility, active tools, and camera mode
- **Selection Context**: Object selection and interaction state

## Data Flow

### Model Upload and Processing
1. User selects FBX file through file input
2. Frontend validates file and shows loading state
3. FBX loader parses the file and creates Three.js objects
4. Model is cached in memory for performance
5. Scene is updated with new model and bounding box calculations

### 3D Interaction Pipeline
1. Mouse/touch events captured by Three.js renderer
2. Raycasting determines object intersections
3. Tool handlers process interactions based on active tool
4. State updates trigger re-renders and visual feedback
5. Transform controls allow object manipulation

### Lighting and Environment Updates
1. UI controls modify lighting/environment state
2. State changes trigger Three.js light property updates
3. Shadow maps and render targets are updated
4. Scene background and fog properties are adjusted

## External Dependencies

### Frontend Dependencies
- **Three.js**: 3D graphics rendering and scene management
- **@radix-ui**: Accessible UI component primitives
- **@tanstack/react-query**: Server state synchronization
- **class-variance-authority**: CSS class composition
- **date-fns**: Date manipulation utilities
- **embla-carousel**: Touch-friendly carousel component

### Backend Dependencies
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **connect-pg-simple**: PostgreSQL session store
- **express**: Web application framework
- **tsx**: TypeScript execution for development

### Development Dependencies
- **TypeScript**: Static type checking
- **Vite**: Frontend build tool and dev server
- **ESBuild**: Backend bundling and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS transformation and processing

## Deployment Strategy

### Development Environment
- Frontend: Vite dev server with HMR and React Fast Refresh
- Backend: tsx watch mode for automatic TypeScript compilation
- Database: Drizzle push for schema synchronization

### Production Build
- Frontend: Vite production build with code splitting and optimization
- Backend: ESBuild bundle with external dependencies
- Assets: Static file serving through Express
- Database: Drizzle migrations for schema management

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development/production mode detection via `NODE_ENV`
- Replit-specific integrations for cloud deployment

## Changelog
```
Changelog:
- July 04, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```