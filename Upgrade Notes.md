# Upgrade Notes
> **Goal:** Upgrade all dependencies and remove all deprecations and other console warnings.

## Plan
- Need to upgrade webpack before adding typescript because of `ts-loader` dependency.
- Should address vulnerabilities listed by npm. Consider running `npm audit fix`.
- Want to use typescript to replace proptypes

## Notes

### Migrating to Webpack v5
> "When using [hash] placeholder in webpack configuration, consider changing it to [contenthash]. It is not the same, but proven to be more effective."

> "If you have rules defined for loading assets using raw-loader, url-loader, or file-loader, please use [Asset Modules](https://webpack.js.org/guides/asset-modules/) instead as they're going to be deprecated in near future."