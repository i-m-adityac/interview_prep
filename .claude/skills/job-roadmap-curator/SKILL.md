---
name: job-roadmap-curator
description: Generate a personalized, duration-aware interview-prep roadmap for a specific job and wire it into this repo's study site. Use when the user gives a job ID, a careers/job-posting URL, or a pasted job description and wants a custom "roadmap", "prep plan", or "company prep" path fitted to a target preparation window (e.g. "in 6 weeks", "2 months", "10 days") that goes from starting out to cracking the loop. It reads the job description, sizes the plan to the requested duration, maps it onto the repo's DSA / HLD / LLD / coding-problem content, adds any missing problems, writes the plan into its own file under webapp/custom_paths/, and validates every reference.
---

# Job Roadmap Curator

Turn a single job identifier into a complete, click-through study plan inside the FAANG Prep site. The plan is written to its own file under `webapp/custom_paths/<slug>.js`, which appends `DATA_CUSTOM.paths[<jobId>]` to the shared container declared in `webapp/data_custom.js`. It renders in the site's **Company Prep** tab, where each item is a checkbox that links straight to the matching DSA pattern, HLD/LLD topic, or LeetCode problem.

### Why per-job files instead of one growing file
Every roadmap used to be appended into a single `data_custom.js`. That meant each new roadmap required reading the whole accumulated file first (to avoid key collisions and preserve existing paths) — a cost that grows with the total number of roadmaps ever curated, not just the new one. Splitting into one small file per job keeps that cost flat: curating job #20 is exactly as cheap as curating job #1, since you only ever touch the new job's own file.

## Inputs

**Job identity** — the user may provide any of:

- A **job ID** (e.g. `ADOBUSR169874EXTERNALENUS`) — the primary key for the path.
- A **careers URL** — derive the job ID from the URL and fetch the page for the description.
- A **pasted job description** — ask for or infer a short stable ID (kebab or the company's own code).

If you only have an ID or URL and not the full text, fetch it (WebFetch / WebSearch) before planning. If the description cannot be retrieved, ask the user to paste it rather than guessing at the role's stack.

**Preparation duration** — how long the user has to prepare. This sizes the whole plan.

- Accept it in any unit: weeks (`6 weeks`), months (`2 months` → ~8 weeks), or days (`10 days`).
- If the user does not state a duration, **ask for it** before planning (offer 12 weeks as the default). Do not silently assume 12 weeks when a duration is expected.
- Normalize to a phase count `N` and a phase unit:
  - **≥ 3 weeks** → one phase per week; `N` = number of weeks. Titles read `Week 1: …`, `Week 2: …`.
  - **< 3 weeks / day-based** → use shorter sprints so there are still 4-7 phases. Titles read `Days 1-2: …`, `Days 3-4: …`. Treat each sprint as one entry in the `weeks` array (the field name stays `weeks`; only the titles change).
- Optionally capture weekly intensity if the user offers it (e.g. "~2 hrs/day", "weekends only") and trim item counts per phase to match; otherwise assume a standard full prep load.

## Data model you write into

`webapp/data_custom.js` only declares the shared container and stays a stub:

```js
const DATA_CUSTOM = { paths: {} };
```

Each job gets its own file at `webapp/custom_paths/<slug>.js` (slug = short kebab-case company+role, e.g. `adobe-sde2-python-genai.js` — not the raw job ID, which stays as the object key). That file appends one entry:

```js
DATA_CUSTOM.paths["<JOB_ID>"] = {
  jobTitle: "Company Role (stack focus)",   // shown as the path heading
  jobUrl: "https://...",                     // optional; rendered as a link
  weeks: [
    {
      title: "Week N: Theme",
      desc: "One-line focus for the week.",
      items: [ /* item objects, see below */ ]
    }
  ]
};
```

Each item is one of these shapes. The `type` decides how it renders and where its "Go to…" button jumps:

| type       | required fields          | renders as       | refId must exist in                          |
|------------|--------------------------|------------------|----------------------------------------------|
| `dsa`      | `text`, `refId`          | DSA Pattern chip | `DATA_DSA.patterns[].id` (`data_dsa.js`)      |
| `system`   | `text`, `refId`          | HLD Topic chip   | `DATA_SYSTEM.sdFundamentals[].id` or `sdCases[].id` (`data_system.js`) |
| `lld`      | `text`, `refId`          | LLD Concept chip | `DATA_LLD.lldFundamentals[].id` or `lldCases[].id` (`data_lld.js`) |
| `problem`  | `text`, `refId`          | Coding Problem   | keys of `DATA_PROBLEMS` (`data_problems.js`)  |
| `custom`   | `text`                   | plain task       | (no refId — role-specific work with no core mapping) |

```js
{ text: "Review Two Pointers templates and search-space reduction", type: "dsa", refId: "two-pointers" }
{ text: "Study HLD Caching: cache-aside, stampedes, eviction", type: "system", refId: "sd-caching" }
{ text: "Study SOLID principles in low-level design", type: "lld", refId: "lld-solid" }
{ text: "Solve 'Two Sum'", type: "problem", refId: "two-sum" }
{ text: "Deep-dive Python asyncio event loops and coroutines", type: "custom" }
```

**Hard rule:** every `dsa` / `system` / `lld` / `problem` `refId` must resolve to a real ID. Either reference an existing ID or add a new problem to `data_problems.js` first (see Phase 3). Never invent a `dsa`/`system`/`lld` ID — those content pages are fixed; if a role needs something with no matching page, model it as a `custom` item instead.

## Valid reference IDs

Confirm the current sets before planning (they may have grown), then only use IDs from them:

```bash
# DSA pattern ids
grep -oE 'id: "[a-z0-9-]+"' webapp/data_dsa.js
# HLD topic + case ids
grep -oE 'id: "[a-z0-9-]+"' webapp/data_system.js
# LLD topic + case ids
grep -oE 'id: "[a-z0-9-]+"' webapp/data_lld.js
# Existing problem ids
grep -oE '"[a-z0-9-]+":' webapp/data_problems.js
```

Snapshot at time of writing (verify with the commands above):

- **DSA** (`data_dsa.js`): `coding-playbook`, `arrays-hashing`, `two-pointers`, `sliding-window`, `stack`, `binary-search`, `linked-list`, `trees`, `tries`, `heap`, `backtracking`, `graphs`, `matrix-grids`, `adv-graphs`, `dp-1d`, `dp-2d`, `greedy`, `intervals`, `bits`, `design`
- **HLD** (`data_system.js`): `sd-framework`, `sd-estimation`, `sd-loadbalancing`, `sd-caching`, `sd-database`, `sd-sql-nosql`, `sd-cap`, `sd-consistent-hashing`, `sd-queues`, `sd-cdn-storage`, `sd-ratelimit-api`, `sd-observability`, `sd-realtime`, `sd-transactions`, `sd-auth`, and cases `case-url-shortener`, `case-rate-limiter`, `case-kv-store`, `case-chat`, `case-newsfeed`, `case-video`, `case-notifications`, `case-typeahead`, `case-rag`, `case-llm-serving`
- **LLD** (`data_lld.js`): `lld-approach`, `lld-solid`, `lld-patterns-core`, `lld-concurrency`, and cases `lld-parking`, `lld-vending`, `lld-elevator`, `lld-splitwise`, `lld-bookmyshow`, `lld-snake-ladder`, `lld-logger`, `lld-ride-hailing`

## Procedure

### Phase 1 — Establish inputs (job description + duration)
Get the full JD text. Extract: company, title, level (SDE-2 / Senior / Staff…), primary languages, core system areas (distributed systems, streaming, storage, realtime, etc.), any specialized domain (GenAI/RAG, cloud, data pipelines, mobile…), and the preferred qualifications. These signals drive emphasis and phase ordering.

Then confirm the **preparation duration** (see Inputs). Normalize it to a phase count `N` and a phase unit before planning — if it was not given, ask now. `N` is the exact number of entries you will put in the `weeks` array.

### Phase 2 — Map requirements to the core library
Sort the needs into DSA, HLD, LLD, and specialized domains, then map each to an existing ID from the lists above. Anything specialized with no matching core page becomes `custom` work (e.g. "Implement a semantic prompt-cache with vector-similarity thresholds").

### Phase 3 — Add any missing coding problems
Pick the problems the loop is likely to test. For any not already in `DATA_PROBLEMS`, add them to `webapp/data_problems.js` with a unique kebab-case key and:

```js
"problem-id": { name: "Display Name", diff: "E" | "M" | "H", url: "https://leetcode.com/problems/.../", pattern: "<dsa-pattern-id>" }
```

Use real LeetCode URLs and a `pattern` that is a valid DSA id. Do not duplicate an existing problem under a new key — reuse the existing key.

### Phase 4 — Build the curriculum sized to the duration
Produce exactly `N` phases (the count normalized in Phase 1). The arc always reads "from starting to cracking" — foundations and core patterns first, then HLD/LLD and role-specific depth, closing with behavioral (STAR) prep and timed mocks — but how much fits depends on `N`. Allocate roughly: first ~15% foundations, ~45% DSA patterns + problems, ~25% HLD/LLD + role-specific depth, final ~15% behavioral and mock loops. Never drop the closing mock/STAR phase, however short the window.

Scale the content, not just the phase count:

| Window            | Coverage strategy                                                                                     | Per-phase load                                  |
|-------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| **Short** (≤ 4 wk / days) | Only the highest-signal areas from the JD. Merge or skip low-priority patterns. Foundations compressed into the first sprint. One consolidated mock at the end. | 1-2 reviews + 1-2 must-do problems + 1 role `custom` |
| **Standard** (5-10 wk) | Cover all core patterns the role needs, main HLD topics, key LLD, and the role's specialized domain. | 2-3 reviews + 2-3 problems + 1-2 role `custom`  |
| **Long** (11+ wk)  | Full breadth plus depth: extra problems per pattern, more HLD/LLD cases, dedicated revision phases, and 2+ mock rounds. | 3-4 reviews + 3+ problems + 1-2 role `custom`   |

When the window is too short to cover everything the JD implies, prioritize by what the loop most likely tests (coding + the role's core system area) and say in the Phase 7 summary what you deferred. Each phase gets a `title`, a one-line `desc`, and its `items` mix.

### Phase 5 — Write the new job's file and wire it in
1. Create `webapp/custom_paths/<slug>.js` (kebab-case company+role slug) containing only `DATA_CUSTOM.paths["<JOB_ID>"] = { ... };` — do not touch any other job's file.
2. Add one `<script src="custom_paths/<slug>.js"></script>` line in `webapp/index.html`, after the `data_custom.js` line and before `data.js` (load order matters: the container must exist before this file appends to it).
3. Do not edit `webapp/data_custom.js` itself unless it has drifted from the stub shape — it should never contain job entries directly.
4. Keep the existing file style (2-space indent, double quotes on keys). No emojis anywhere (repo convention in `.agents/AGENTS.md`).

### Phase 6 — Validate
Run the bundled validator (needs Node; the working directory is the repo root):

```bash
node .claude/skills/job-roadmap-curator/scripts/validate.js
```

It loads all data files, including every file under `custom_paths/`, and checks every `refId` in every custom path. Success prints `SUCCESS: All custom path references are valid!`. On any `Error: … invalid … refId`, fix the offending reference (correct the ID, or add the missing problem) and re-run until clean.

### Phase 7 — Summarize
Give the user: the job title and ID added, the total duration the plan fits (`N` phases over the requested window), the per-phase themes in one line each, the count of new problems introduced, anything you deferred because the window was tight, and a pointer to open the **Company Prep** tab (`webapp/index.html`) and select this path to start studying.

## Guardrails

- Honor the requested preparation duration: the `weeks` array must have exactly `N` entries. If no duration was given, ask before planning (default 12 weeks).
- Never invent `dsa`/`system`/`lld` IDs; use only IDs confirmed to exist. Unmapped role needs are `custom` items.
- Every `problem` refId must exist in `DATA_PROBLEMS` — add it first if needed.
- Preserve all pre-existing paths and problems; this skill only adds. Never edit another job's file in `custom_paths/`.
- One job per file in `webapp/custom_paths/`; never append a new job into `webapp/data_custom.js` (it stays the empty-container stub) or into another job's file.
- `diff` is exactly one of `"E"`, `"M"`, `"H"`.
- No emojis in code, data, comments, or the summary.
- The validator must pass before you report done.
