# Whispering Woods Portfolio - Setup Guide

## Quick Start

This portfolio uses **TanStack Start** with **Vite**, **React**, and **Tailwind CSS**. Follow these steps to get it running locally.

### Prerequisites

You need Node.js v20.19+ or v22.13+ installed on your system.

- Download from: https://nodejs.org/
- Or install via package manager (winget, brew, apt, etc.)

### Installation & Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The dev server will open at **http://localhost:8080/**

### Available Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm lint         # Run ESLint
npm run format   # Format code with Prettier
```

### Project Structure

```
src/
├── routes/           # Page components
├── components/       # Reusable UI components
├── lib/              # Utilities and helpers
├── styles.css        # Global styles (Tailwind)
├── router.tsx        # Route definitions
└── start.ts          # Entry point
```

### Tech Stack

- **React 19** - UI library
- **TanStack Start** - Meta-framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible component library
- **TypeScript** - Type safety

### Deployment

The project is configured for **Cloudflare Workers** deployment via Wrangler.

```bash
wrangler deploy
```

See `wrangler.jsonc` for configuration details.

---

**Built with love and Ghibli inspiration** ✨
