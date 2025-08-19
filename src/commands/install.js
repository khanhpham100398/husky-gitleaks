import fs from "fs";
import os from "os";
import path from "path";
import { run } from "../utils/exec.js";
import { fileExists } from "../utils/fs.js";
import { log } from "../utils/log.js";
import { GITLEAKS_VERSION } from "../config.js";

export async function install() {
  log("Step 1: Detect NPM project");
  if (!fileExists("package.json")) {
    throw new Error("No package.json found. Run `npm init` first.");
  }

  log("Step 2: Detect Husky dependency");
  const pkg = JSON.parse(fs.readFileSync("package.json", "utf-8"));
  if (!pkg.devDependencies?.husky) {
    throw new Error("Husky not found. Please install Husky first.");
  }

  log("Step 3: Detect Operating System");
  const platform = os.platform();
  let binaryUrl;
  if (platform === "linux") {
    binaryUrl = `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz`;
  } else if (platform === "darwin") {
    binaryUrl = `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_darwin_x64.tar.gz`;
  } else if (platform.startsWith("win")) {
    binaryUrl = `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_windows_x64.zip`;
  } else {
    throw new Error(`Unsupported OS: ${platform}`);
  }

  log("Step 4: Download & install GitLeaks");
  const binDir = path.resolve("node_modules/.bin");
  fs.mkdirSync(binDir, { recursive: true });

  const dest = path.join(binDir, platform.startsWith("win") ? "gitleaks.exe" : "gitleaks");
  run(`curl -L -o ${dest} ${binaryUrl}`);
  fs.chmodSync(dest, 0o755);

  const configPath = "gitleaks.toml";
  if (!fileExists(configPath)) {
    log("Copying default config...");
    fs.writeFileSync(configPath, `title = "GitLeaks Config"\n[allowlist]\n  description = "allow nothing"\n`);
  }

  const versionOutput = run(`${dest} version`);
  log(`GitLeaks installed: ${versionOutput}`);

  log("Step 5: Configure Husky hook");
  pkg.scripts = pkg.scripts || {};
  pkg.scripts.gitleaks = "gitleaks protect --staged --config=gitleaks.toml";
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));

  const huskyHook = ".husky/pre-commit";
  if (fileExists(huskyHook)) {
    const hookContent = fs.readFileSync(huskyHook, "utf-8");
    if (!hookContent.includes("npm run gitleaks")) {
      fs.appendFileSync(huskyHook, "\nnpm run gitleaks\n");
      log("Inserted gitleaks into pre-commit hook.");
    }
  } else {
    throw new Error("Husky hook not found. Run `npx husky add .husky/pre-commit` first.");
  }

  log("Step 6: Finish 🎉");
  console.log("✅ GitLeaks setup complete!");
  console.log(`   Version: ${versionOutput}`);
  console.log(`   Config:  ${configPath}`);
}
