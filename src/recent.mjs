// Rewrites the "Recently shipped" list in README.md from my latest public commits.
// Commits that only touch docs or images are skipped, so the list shows code and config.
// Runs daily in GitHub Actions (see .github/workflows/recent.yml). Run locally: GITHUB_TOKEN=... node src/recent.mjs

import { readFileSync, writeFileSync } from "node:fs";

const OWNER = "braydenscuffham2-coder";
const REPOS = ["pip-ai", "lecivo"];
const COUNT = 5;
const LOOKBACK = 20; // commits per repo to inspect
const README = new URL("../README.md", import.meta.url);
const START = "<!-- recent:start -->";
const END = "<!-- recent:end -->";
const DOCS_ONLY = /(^|\/)(README|CHANGELOG)[^/]*$|\.(md|webp|png|jpe?g|gif|svg)$/i;

const headers = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

async function get(path) {
  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

async function commits(repo) {
  const list = await get(`/repos/${OWNER}/${repo}/commits?per_page=${LOOKBACK}`);
  const keep = list.filter((c) => c.parents.length === 1 && !/\[bot\]$/.test(c.author?.login || ""));
  const detailed = await Promise.all(keep.map((c) => get(`/repos/${OWNER}/${repo}/commits/${c.sha}`)));
  return detailed
    .filter((c) => c.files?.some((f) => !DOCS_ONLY.test(f.filename)))
    .map((c) => ({ repo, url: c.html_url, title: c.commit.message.split("\n")[0], at: c.commit.author.date }));
}

const day = (iso) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "America/Boise" });
const all = (await Promise.all(REPOS.map(commits))).flat().sort((a, b) => b.at.localeCompare(a.at)).slice(0, COUNT);
if (all.length === 0) throw new Error("no commits found; leaving the README as it is");
const lines = all.map((c) => `- [${c.title.replace(/[[\]]/g, "")}](${c.url}) · \`${c.repo}\` · ${day(c.at)}`).join("\n");

const md = readFileSync(README, "utf8");
const a = md.indexOf(START), b = md.indexOf(END);
if (a < 0 || b < a) throw new Error("README markers not found");
const next = `${md.slice(0, a + START.length)}\n${lines}\n${md.slice(b)}`;
if (next !== md) { writeFileSync(README, next); console.log("README updated"); } else console.log("no change");
