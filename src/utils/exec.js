import { execSync } from "child_process";

export function run(cmd) {
  try {
    return execSync(cmd, { stdio: "pipe" }).toString().trim();
  } catch (err) {
    return null;
  }
}
