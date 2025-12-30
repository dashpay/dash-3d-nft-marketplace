# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router pages. Use lowercase segments and dynamic routes like `src/app/nft/[id]/page.tsx`.
- `src/components`: Reusable React components (PascalCase, e.g., `NFTCard.tsx`).
- `src/lib`: SDK wrappers, utilities, and data services.
- `src/store`: Zustand state containers.
- `src/dash-sdk-src`: Internal SDK stubs/providers used by the app.
- `src/wasm`: WASM bindings and mocks.
- `src/test` and `**/__tests__/**`: Jest tests.
- `public`: Static assets.

## Build, Test, and Development Commands
- `npm run dev`: Start local dev at `http://localhost:3000`.
- `npm run build`: Production build with Next.js.
- `npm start`: Serve the production build.
- `npm run lint`: Run ESLint/Next checks.
- `npm test` | `npm run test:watch`: Run Jest tests.
- `npm run test:coverage` | `npm run test:ci`: Coverage/CI-friendly tests.

## Coding Style & Naming Conventions
- **Language**: TypeScript (strict). **Indentation**: 2 spaces. Prefer named exports.
- **Components**: PascalCase; **hooks**: `useX` in `src/hooks` (e.g., `useWallet.ts`).
- **Routes**: Lowercase folders; dynamic `[id]` segments.
- **Paths**: Import via alias `@/` (e.g., `@/lib/api`). Configure in `tsconfig.json`.
- **Styling**: Tailwind CSS. Keep classes declarative; guard against SSR/hydration issues with a `ClientOnly` wrapper where necessary.

## Testing Guidelines
- **Frameworks**: Jest + Testing Library (`jsdom`).
- **Locations**: `src/test/*.test.ts(x)` or `__tests__/*.test.ts(x)`.
- **Coverage**: Focus on `src/dash-sdk-src/**`; run `npm run test:coverage`.
- **Conventions**: One behavior per test; deterministic data; mock WASM in `jest.setup.js`.

## Commit & Pull Request Guidelines
- **Commits**: Concise, imperative subjects; optional scope. Example: `feat(components): add NFT card hover`.
- **PRs must include**: Summary, rationale, screenshots for UI, test plan/coverage, linked issues, and notes on DX/security impacts.
- **Quality gates**: `npm run lint` and `npm test` pass; update docs when behavior changes.

## Security & Configuration Tips
- Use `.env.local` for local settings; never commit secrets.
- Public config via `NEXT_PUBLIC_*` only (e.g., `NEXT_PUBLIC_NETWORK`).
- Do not introduce private key handling; app is read-only to the blockchain.

