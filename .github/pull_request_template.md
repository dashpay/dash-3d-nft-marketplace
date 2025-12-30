## Summary
Briefly describe the change and why it matters.

## Rationale
What problem does this solve? User impact and goals.

## Changes
- List key changes (files, components, APIs)
- Note breaking changes or migrations

## Screenshots / Demos (UI)
Attach screenshots or GIFs if UI changed.

## Test Plan
- Commands run: `npm run lint`, `npm test`, `npm run test:coverage`
- Edge cases covered and how they’re exercised

## Coverage Notes
Focus on `src/dash-sdk-src/**`; link to coverage output if relevant.

## Security / Config
- Env vars: only `NEXT_PUBLIC_*` introduced/changed
- No secrets committed; `.env.local` updated locally
- No private key handling added

## Linked Issues
Closes #<issue>, Related #<issue>

## Developer Experience
Docs updated (README/AGENTS), DX impacts noted

## Checklist
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm test`
- [ ] Coverage acceptable: `npm run test:coverage`
- [ ] Docs updated where behavior changed
- [ ] No secrets or non-public config committed

