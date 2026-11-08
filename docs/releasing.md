# Releasing packages

1. Merge a package change with a Changesets entry into `main`.
2. The release workflow opens or updates a Version Packages pull request.
3. Review the package version and generated changelog, then merge the release pull request.
4. The workflow verifies the repository and publishes only changed packages with `changeset publish`.
5. Confirm the npm version, package contents, provenance, GitHub Release, and tag before announcing the release.

The first Changesets release is a major bump (`0.0.0` → `1.0.0`). npm requires a package to exist before its Trusted Publisher can be configured, so bootstrap this new package once from the reviewed `0.0.0` artifact:

1. Use an npm account with write access to `@barkbyborders` and 2FA enabled. From `packages/localization`, publish the bootstrap version under a non-latest tag:

   ```sh
   npm publish --access public --tag bootstrap
   ```

2. Configure and verify GitHub Actions trusted publishing. The npm CLI must be `11.15.0` or later:

   ```sh
   npm trust github @barkbyborders/localization --file release.yml --repo kia6918/barkbyborders-toolkits --allow-publish
   npm trust list @barkbyborders/localization
   ```

3. Merge the Version Packages pull request soon after trust setup. It publishes `1.0.0` as `latest`; a new npm trusted-publisher configuration expires unless its first publish succeeds within two days.

The release workflow installs pnpm with `pnpm/action-setup@v6` so pnpm 11 forwards npm's OIDC identity correctly. npm Trusted Publishing uses short-lived credentials; do not add an npm token to GitHub secrets or commit a local `.npmrc`.

For later changes, use `pnpm changeset` and choose patch, minor, or major based on the public API impact. Only the package with a changeset is published.
