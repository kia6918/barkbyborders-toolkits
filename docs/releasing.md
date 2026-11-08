# Releasing packages

1. Merge a package change with a Changesets entry into `main`.
2. The release workflow opens or updates a Version Packages pull request.
3. Review the package version and generated changelog, then merge the release pull request.
4. The workflow verifies the repository and publishes only changed packages with `changeset publish`.
5. Confirm the npm version, package contents, provenance, GitHub Release, and tag before announcing the release.

The first publish is a major changeset (`0.0.0` → `1.0.0`). Before merging its release pull request, configure `@barkbyborders/localization` to trust GitHub Actions in `kia6918/barkbyborders-toolkits`, using `.github/workflows/release.yml` and the `npm publish` permission. npm Trusted Publishing uses short-lived OIDC credentials; do not add an npm token to GitHub secrets.

For later changes, use `pnpm changeset` and choose patch, minor, or major based on the public API impact. Only the package with a changeset is published.
