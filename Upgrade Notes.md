# Upgrade Notes
> **Goal:** Upgrade all dependencies and remove all deprecations and other console warnings.

## Plan
- [x] Upgrade to Webpack 5 (Need to upgrade webpack before adding typescript because of `ts-loader` dependency.) Instructions: https://webpack.js.org/migrate/5/#upgrade-webpack-to-5
- [ ] Set up TypeScript. Migrate one file at a time to replace PropTypes with actual types. Make sure webpack is creating a `.d.ts` file in `/dist` (and optionally `/playground`, but it's not very important)

## Notes

- I tried running `npm audit fix` but it didn't do anything.