# Quewui

A retro terminal-style UI built with React, TypeScript, and Vite. This interactive web application mimics a classic terminal interface with a modern twist, offering both a neon-inspired dark theme and a Debian installer-inspired light theme.

## Features

- Terminal-inspired UI with command interface
- Vim-like keyboard navigation
- Multiple view components (Home, About, Projects, Experiences, etc.)
- Theme switching (light/dark mode)
- Command history tracking
- Responsive design with CSS

## Setup and Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/retro-quewui.git
cd retro-quewui

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Commands

The terminal interface accepts the following commands:

- `help` - Display available commands
- `home`, `about`, `projects`, `experiences`, `blog`, `contact`, `stats` - Navigate to different views
- `theme` - Toggle between light and dark theme
- `clear` - Clear the terminal screen
- `exit` - Exit command mode

## Tech Stack

- React 18
- TypeScript
- Vite
- CSS
- Zustand (State Management)
- React Markdown
- Headless UI

## Project Structure

```
src/
  ├── components/       # UI components
  ├── store/            # State management
  ├── views/            # View components
  ├── data/             # API and mock data
  ├── types/            # TypeScript types
  ├── assets/           # Static assets
  └── App.tsx           # Main application
```

## Development

To improve type-checking and linting, you can update the ESLint configuration:

```js
// eslint.config.js
import { javascriptESLint } from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## License

MIT
