This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

docker buildx build --platform linux/amd64 -t crgallardoglobalshared.azurecr.io/counter:v1.0.1 --push .

docker buildx build --platform linux/amd64 -t crgallardoglobalshared.azurecr.io/counter:v2.0.0 --push .

## Tests

Integration tests use Vitest, jsdom, and Testing Library:

```bash
pnpm test
pnpm test:coverage
pnpm test:watch
```

Functional tests use Playwright and run against desktop and mobile Chromium:

```bash
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright builds and starts the production application so it can also verify
the service worker and every tool while the browser is offline.

Run both suites with:

```bash
pnpm test:all
```

Playwright starts the Next.js development server automatically on
`127.0.0.1:3000`. Reports and traces are written to ignored test-output
directories.

The regression suite protects these user-facing contracts:

- global language, theme, footer wake lock, navigation, and help content;
- counter templates, custom edits, counting, reset, deletion, and storage;
- Choasis manual selection, limits, and the five-player touch boundary;
- timer configuration, controls, persistence, completion, and alarm request;
- score-sheet structure, totals, winner, clearing, reset, and persistence.

Vitest exercises state and component integration quickly. Playwright repeats
the critical journeys in real desktop and mobile Chromium. New behavior should
be added to this list and receive a regression test at the lowest useful layer;
critical journeys should also receive an end-to-end test.

## Offline use and installation

The production build registers a service worker powered by Serwist. On the
first online visit it precaches every tool, the application shell, images, and
the timer alarm. Later visits work without a connection, both in the browser
and when the PWA is added to the device home screen. Development mode leaves
the service worker disabled to prevent stale caches while coding.
