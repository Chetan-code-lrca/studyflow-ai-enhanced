# StudyFlow AI

StudyFlow is a small React app for keeping track of subjects, study time, assignments, and progress in one place.

It runs entirely in the browser. There is no backend or account system, and the app saves its data with `localStorage`.

## What it does

### Subjects

Add subjects and track progress against a 40-hour target. Each subject has quick buttons for adding 30 minutes, 1 hour, or 2 hours of study time.

### Schedule

See subject progress and recent study sessions.

### Assignments

Add an assignment with a subject, deadline, and priority. Assignments can be marked complete or removed. Items due within three days are treated as upcoming, and past deadlines are shown as overdue.

### Analytics

The analytics view shows total study time, study time from the last seven days, assignment completion rate, upcoming deadlines, subject progress, and study suggestions.

The suggestions are rule-based. They look at things such as overdue assignments, upcoming deadlines, low subject progress, and common CSE subjects including DSA, DBMS, and Operating Systems.

## Tech stack

- React 18
- TypeScript
- Vite 5
- `localStorage`

The production build runs TypeScript checking before Vite creates the `dist/` directory. fileciteturn769file0

## Run locally

### Requirements

Install Node.js and npm.

### Clone and install

```bash
git clone https://github.com/Chetan-code-lrca/studyflow-ai-enhanced.git
cd studyflow-ai-enhanced
npm install
```

### Start the app

```bash
npm run dev
```

Vite normally serves the development app at:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

This runs `tsc` followed by `vite build`. fileciteturn769file0

### Preview the production build

```bash
npm run preview
```

## GitHub Pages

The repository has a GitHub Actions workflow that builds `dist/` and deploys it to GitHub Pages whenever `main` is updated. A manual workflow run is also available from GitHub Actions. fileciteturn732file0

The Vite base path is configured as:

```text
/studyflow-ai-enhanced/
```

so the generated asset URLs work from the repository's Pages path. fileciteturn751file0

The project also includes a `deploy` script using `gh-pages`:

```bash
npm run deploy
```

That command publishes the contents of `dist/`. fileciteturn769file0

## Data and privacy

StudyFlow does not have a server-side database. These values are stored in browser storage:

```text
studyflow_subjects
studyflow_assignments
studyflow_sessions
```

The data stays in the browser profile where the app is being used. Clearing browser storage removes it, and another browser or device will not have the same data.

## Project structure

```text
studyflow-ai-enhanced/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

`src/App.tsx` contains the application's state, storage, calculations, recommendations, and UI. `src/main.tsx` mounts the React application. fileciteturn733file0 fileciteturn758file0

## Using StudyFlow

Add a subject from the **Subjects** tab, then use the study-time buttons to record sessions. Add deadlines in **Assignments** and use **Analytics** to see overall progress.

New subjects start with a 40-hour target. Study sessions are recorded separately so the app can calculate weekly study time.

## About the name

The project is called StudyFlow AI, but the current recommendation system is local application logic rather than an LLM or hosted AI service. The repository contains no AI API requirement for the main app.

## Current limitations

The current version is deliberately simple:

- subject targets are fixed at 40 hours when a subject is created;
- there is no login, database, or cloud sync;
- there are no push notifications;
- study data is tied to the browser's local storage;
- there are no automated application tests in the repository.

## License

MIT
