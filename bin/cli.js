#!/usr/bin/env node
import { install } from "../src/commands/install.js";

const [,, cmd] = process.argv;

switch (cmd) {
  case "install":
    try {
      await install();
    } catch (err) {
      console.error("❌ Error:", err.message);
      process.exit(1);
    }
    break;
  default:
    console.log("Usage: setup-husky-gitleaks <command>");
    console.log("Commands:");
    console.log("  install   Setup GitLeaks with Husky");
    break;
}
