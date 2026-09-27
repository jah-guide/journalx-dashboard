import { cpSync, emptyDirSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "dist", "client");
const pagesBase = process.env.VITE_BASE ?? "/journalx-dashboard/";

function run(cmd, opts = {}) {
  execSync(cmd, { cwd: root, stdio: "inherit", ...opts });
}

console.log(`Building for GitHub Pages (VITE_BASE=${pagesBase})…`);
run(`npm run build:pages`, {
  env: { ...process.env, VITE_BASE: pagesBase },
});

if (!existsSync(path.join(outDir, "index.html"))) {
  throw new Error(`Missing ${outDir}/index.html — build did not prerender.`);
}

writeFileSync(path.join(outDir, ".nojekyll"), "");
const indexHtml = readFileSync(path.join(outDir, "index.html"));
writeFileSync(path.join(outDir, "404.html"), indexHtml);

const workDir = path.join(root, ".gh-pages-publish");
emptyDirSync(workDir);
cpSync(outDir, workDir, { recursive: true });

run("git init", { cwd: workDir });
run('git checkout -b gh-pages', { cwd: workDir });
run("git add -A", { cwd: workDir });
run(
  'git -c user.name="jah-guide" -c user.email="jah-guide@users.noreply.github.com" commit -m "Deploy GitHub Pages"',
  { cwd: workDir },
);

const remote = execSync("git remote get-url origin", { cwd: root, encoding: "utf8" }).trim();
run(`git push --force ${remote} gh-pages`, { cwd: workDir });

console.log("Published gh-pages branch.");
