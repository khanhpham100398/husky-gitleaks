import fs from "fs";

export function fileExists(path) {
  try {
    return fs.existsSync(path);
  } catch {
    return false;
  }
}
