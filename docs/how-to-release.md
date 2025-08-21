## How to publish package to NPM registry

- For example, when you click **"Create Release v\<x.x.x\>"** in GitHub:

  - The Action is triggered (`on: release: types: [published]`).
  - GitHub Actions will:
    - Checkout the source (including `package.json`, `bin/`, `src/`).
    - Set up Node.js with specific version.
    - Run `npm ci` → install dependencies (almost nothing here since the code uses built-in Node).
    - Run `npm publish` → upload the package to **npmjs.org**.

- On npmjs, the package **`setup-husky-gitleaks@\<x.x.x\>`** will appear.
