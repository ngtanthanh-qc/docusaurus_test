# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Docusaurus v3 documentation website used as Anthony's personal knowledge base, technical blog, and learning log. The site is fully public — no authentication.

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
- **Docusaurus 3.9+**: Static site generator for documentation
- **React 18**: UI framework
- **TypeScript**: Type safety for components

### Project Structure

- `/docs/` - Documentation content in MDX format
  - `/config-pyats-environment/` - pyATS automation guides
  - `/networking/` - Networking documentation (802.1X, CCNA, SDA)
- `/blog/` - Blog posts with MDX support
- `/src/` - Source code
  - `/components/` - Custom React components (Highlight, HomepageFeatures)
  - `/pages/` - Custom React pages
  - `/css/` - Global styles
- `/plugins/` - Custom Docusaurus plugins (e.g. recent-blog-posts)
- `/static/` - Static assets (images, favicons)
- `/i18n/` - Translations (en, vi)

### Key Features

1. **Search**: Algolia DocSearch v4 with Ask AI (assistant via Agent Studio) in `docusaurus.config.js`
2. **Live Code Blocks**: Interactive code editor via `@docusaurus/theme-live-codeblock`
3. **Mermaid Diagrams**: Built-in support for technical diagrams
4. **Math Support**: KaTeX for mathematical expressions in blog posts
5. **Image Zoom**: Plugin enabled for detailed image viewing
6. **i18n**: English + Vietnamese locales

### Configuration Files

- `docusaurus.config.js`: Main configuration (site metadata, plugins, themes)
- `sidebars.js`: Documentation sidebar structure (auto-generated from filesystem)
- `tsconfig.json`: TypeScript configuration

## Node Version Requirement

Requires Node.js >= 20.0 (works on Node 25 with `engines: ">=20.0"` if EBADENGINE warnings are not desired).

## Site Purpose & Design Direction

Public site for sharing knowledge, blog posts, and learning notes. Inspiration for UI/UX improvements: https://docusaurus.io/showcase — aim for a polished, distinctive theme that reflects a personal brand (Senior QC Engineer, automation focus).

## Accepted Security Findings

Reviewed via `osv-scanner` and accepted (do not flag in routine audits):

- **`serialize-javascript@6.0.2`** — transitive via `webpack` → `terser-webpack-plugin` / `css-minimizer-webpack-plugin`.
  - GHSA-5c6j-r48x-rmvq (CVSS 8.1 High, XSS) + GHSA-qj8w-gfj5-8c6v (CVSS 5.9 Medium).
  - Fix requires major bump to 7.x which webpack's transitive chain does not accept under `npm audit fix` (no `--force`).
  - **Risk accepted**: dev/build-only — `serialize-javascript` is invoked by webpack/terser in the Node build process to serialize trusted chunks. No untrusted input path. The XSS vector requires attacker-controlled serialized payloads, which never occurs in this static-site build pipeline.
  - Re-evaluate if Docusaurus bumps to a webpack version that pulls `serialize-javascript@7+`.
