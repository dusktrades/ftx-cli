# node-template

Personal template for back-end Node.js projects.

## Installation

1. Create a new repository from this template
2. Run `git clone` on the resulting repository
3. Configure the template for your new project
   - Update `README.md`
   - Update `package.json`
   - Delete `.env.example` or rename to `.env`
4. (Optional) Run `git init` to initialise Git repository
5. Run `npm install` to install dependencies and Git hooks (requires step 4)
6. Run `npm start` to start development server

NOTE: Run `git config core.filemode false` if your development environment causes problematic file permissions (e.g. WSL with mounted drives).

## Features

### Scripting

#### Environment variables

- Secrets
  1. Create `.env` file in root directory (example: `.env.example`) or pass through npm scripts
  2. Access in code with `process.env.{VARIABLE}`

### Linting and formatting

- ESLint (`.eslintrc.json`)
- Prettier (`.prettierrc.json`)

### npm scripts

- `npm run clean:node_modules` — clean `node_modules` directory
- `npm run format:check` — check for formatting issues
- `npm run format:fix` — fix formatting issues
- `npm run lint:check` — check for linting issues
- `npm run lint:fix` — fix linting issues
- `npm start` — start development server

### Git hooks

Runs pre-commit linting and formatting checks.

- Husky (`.huskyrc.json`)
- lint-staged (`.lintstagedrc.json`)

### Ignore files

Best to keep these in sync.

- `.gitignore`
- `.eslintignore`
- `.prettierignore`

### Extras

- VS Code config (`jsconfig.json`)

## Production

### PM2

- `pm2 start npm --name "{PROJECT_NAME}" --watch -- start` — start/watch production server
- `pm2 monit` — monitor realtime logs/metrics
- `pm2 logs` — view logs

## Roadmap

- TypeScript
- Jest
- Improve documentation

## Notes

- Should work on Unix-like operating systems and WSL
