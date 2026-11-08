# Contributing

## Set up

Use Node.js `24.22.1` and pnpm `11.21.0`:

```sh
corepack enable pnpm
pnpm install
pnpm verify
```

## Changes

- Keep package APIs typed and framework-neutral.
- Add or update Vitest coverage for changed behavior and edge cases.
- Run `pnpm verify` before opening a pull request.
- Add a Changesets entry with `pnpm changeset` for every package change.
- Use Conventional Commits with a lowercase subject, such as `fix(localization): preserve unmatched placeholders`.

## Releases

Do not publish from a developer machine or add npm tokens to repository secrets. The `main` branch uses Changesets to create a Version Packages pull request. Merging that pull request publishes changed packages using the configured npm Trusted Publisher. See [release instructions](docs/releasing.md).
