# BarkByBorders Toolkits

Small, framework-neutral TypeScript packages maintained by BarkByBorders. Packages are independently versioned and published to npm.

## Packages

| Package | Description | Status |
| --- | --- | --- |
| [`@barkbyborders/localization`](packages/localization) | Typed nested translation keys, locale switching, fallback messages, and interpolation | Initial `1.0.0` release prepared |

## Development

Requirements: Node.js `24.22.1` and pnpm `11.21.0`.

```sh
corepack enable pnpm
pnpm install
pnpm verify
```

`pnpm verify` runs lint, type-check, tests, build, and an npm package dry run.

## Contributing and releases

Read [CONTRIBUTING.md](CONTRIBUTING.md). Every package change needs a Changesets entry. Merging a feature pull request opens or updates the Version Packages pull request; merging that release pull request publishes the changed packages through npm Trusted Publishing.

## License

MIT. See [LICENSE](LICENSE).
