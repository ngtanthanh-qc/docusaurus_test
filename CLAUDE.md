# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docusaurus v3 documentation website with Firebase authentication integration. The project is a technical blog and documentation site with protected content areas.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Type checking
npm run typecheck

# Run linting
npm run lint

# Serve built site locally
npm run serve

# Deploy to production
npm run deploy

# Clear cache
npm run clear
```

## Architecture

### Core Technologies
- **Docusaurus 3.0.0**: Static site generator for documentation
- **Firebase**: Authentication and cloud functions
- **React 18**: UI framework
- **TypeScript**: Type safety for components

### Project Structure

- `/docs/` - Documentation content in MDX format
  - `/config-pyats-environment/` - pyATS automation guides
  - `/networking/` - Networking documentation (802.1X, CCNA, SDA)
- `/blog/` - Blog posts with MDX support
- `/src/` - Source code
  - `/components/Auth/` - Firebase authentication wrapper
  - `/theme/` - Docusaurus theme customizations
  - `/pages/` - Custom React pages
- `/functions/` - Firebase cloud functions
- `/static/` - Static assets (images, favicons)

### Key Features

1. **Authentication System**: Firebase-based authentication with protected paths (see `src/components/Auth/index.js`)
2. **Search**: Algolia DocSearch integration configured in `docusaurus.config.js`
3. **Live Code Blocks**: Interactive code editor support via `@docusaurus/theme-live-codeblock`
4. **Mermaid Diagrams**: Built-in support for technical diagrams
5. **Math Support**: KaTeX for mathematical expressions in blog posts
6. **Image Zoom**: Plugin enabled for detailed image viewing

### Configuration Files

- `docusaurus.config.js`: Main configuration (site metadata, plugins, themes)
- `sidebars.js`: Documentation sidebar structure (auto-generated from filesystem)
- `firebase.json`: Firebase functions configuration
- `tsconfig.json`: TypeScript configuration

### Authentication Flow

The site uses a custom authentication wrapper (`src/theme/Root.js`) that:
1. Checks authentication state on all routes
2. Protects specific paths defined in `PROTECTED_PATHS`
3. Handles login/logout redirects
4. Shows loading state during auth verification

### Environment Variables

Uses `docusaurus-plugin-dotenv` to load from `.env.local` for Firebase configuration and other sensitive settings.

## Node Version Requirement

Requires Node.js >= 20.0 (Updated for Vercel deployment compatibility)

## Recent Updates

- **Docusaurus**: Upgraded to v3.8.1 (latest stable)
- **Firebase**: Updated to v10.14.1 with custom authentication implementation
- **Dependencies**: All major dependencies updated to latest versions
- **Authentication**: Removed react-firebaseui dependency, implemented custom login component
- **Build**: Compatible with Vercel deployment

## Firebase Setup

1. Copy `.env.local.example` to `.env.local`
2. Add your Firebase credentials
3. Authentication is optional - site will work without Firebase config
- to memoerize 
tham khaảo 1 số showcase: https://docusaurus.io/showcase
caải tieêến phaần thieêết kế, GUI, UI cuủa trang web này cuủa toôi. minuục điích cuủa trang web naày duùng dđể sharing knowledge, block, và learning cuủa toôi.