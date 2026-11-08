# Repository guidance

- Use Node.js `24.22.1` from `.node-version` and pnpm `11.21.0`.
- Keep published packages framework-neutral and free of runtime dependencies unless a concrete need is approved.
- Use TypeScript strict mode, single quotes, semicolons, and two-space indentation.
- Add Vitest coverage for public behavior, including invalid inputs and fallback paths.
- Add a root Changesets entry for every package feature, fix, or dependency change.
- Build before packing. Publish only declared `dist` files, with no workspace or private configuration in the tarball.
- Release from `main` through the Changesets Version Packages PR and npm Trusted Publishing. Never add a long-lived npm publish token.
- Use Conventional Commit subjects, for example `feat(localization): support typed nested translation keys`.
