import { execSync } from "child_process";

try {
  console.log("🔍 Checking build before push...");
  execSync("npm run build", { stdio: "inherit" });
  console.log("✅ Build passed! Proceeding with push...");
} catch {
  console.error("❌ Build failed! Push aborted.");
  process.exit(1);
}
