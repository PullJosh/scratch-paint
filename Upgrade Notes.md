# Upgrade Notes
> **Goal:** Upgrade all dependencies and remove all deprecations and other console warnings.

## Plan
- [x] Upgrade to Webpack 5 (Need to upgrade webpack before adding typescript because of `ts-loader` dependency.) Instructions: https://webpack.js.org/migrate/5/#upgrade-webpack-to-5
- [x] Set up TypeScript.
- [x] Migrate one file at a time to replace PropTypes with actual types.
- [ ] Make sure webpack is creating a `.d.ts` file in `/dist` (and optionally `/playground`, but it's not very important)

## Notes

- I tried running `npm audit fix` but it didn't do anything.

### Upgrading React Version

**Goal:** Upgrade from React 16 to 18.

Prerequisites before upgrading to React 17:
- [x] `react-test-renderer` is installed but unused. It can be removed to allow upgrading React.
- [x] Enzyme, the testing library, does not support React 17+. However, it is used *very* little and should be easily replaceable. (Perhaps using React Testing Library.)
  - [x] Install `@testing-library/react` version 12 first because it is compatible with React 16. (Then upgrade it later.)
- [ ] We need to upgrade react-intl. The current version, 2.9.0, does not support React 17+. But the latest version supports both 16.6+ and 17 and 18. So we can upgrade that first while still on React 16.
