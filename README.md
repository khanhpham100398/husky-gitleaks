# Overview

Repository for building tools with Node.js, integrating Husky and Gitleaks.

## How to publish package to NPM registry

- For example, when you click **"Create Release v0.0.1"** in GitHub:

  - The Action is triggered (`on: release: types: [published]`).
  - GitHub Actions will:
    - Checkout the source (including `package.json`, `bin/`, `src/`).
    - Set up Node.js v22.
    - Run `npm ci` → install dependencies (almost nothing here since the code uses built-in Node).
    - Run `npm publish` → upload the package to **npmjs.org**.

- On npmjs, the package **`setup-husky-gitleaks@1.0.0`** will appear.

## How users can run

- Users can immediately run it with:

```sh
npx setup-husky-gitleaks@<version> install
```
