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

Each item is one of these shapes. The `type` decides how it renders and where its button jumps or expands:

| type       | required fields          | renders as       | refId must exist in                          |
|------------|--------------------------|------------------|----------------------------------------------|
| `dsa`      | `text`, `refId`          | DSA Pattern chip | `DATA_DSA.patterns[].id` (`data_dsa.js`)      |
| `system`   | `text`, `refId`          | HLD Topic chip   | `DATA_SYSTEM.sdFundamentals[].id` or `sdCases[].id` (`data_system.js`) |
| `lld`      | `text`, `refId`          | LLD Concept chip | `DATA_LLD.lldFundamentals[].id` or `lldCases[].id` (`data_lld.js`) |
| `problem`  | `text`, `refId`          | Coding Problem   | keys of `DATA_PROBLEMS` (`data_problems.js`)  |
| `topic`    | `text`, `refId`          | Deep-dive with an inline "Show notes" expander (summary + visualization + details) | keys of `DATA_TOPICS.topics` (`data_topics.js`) |
| `custom`   | `text` (+ optional `checklist: []`) | plain task, or a "Show checklist" expander when `checklist` is given | (no refId — one-off hands-on work) |

```js
{ text: "Review Two Pointers templates and search-space reduction", type: "dsa", refId: "two-pointers" }
{ text: "Study HLD Caching: cache-aside, stampedes, eviction", type: "system", refId: "sd-caching" }
{ text: "Study SOLID principles in low-level design", type: "lld", refId: "lld-solid" }
{ text: "Solve 'Two Sum'", type: "problem", refId: "two-sum" }
{ text: "Study Python asyncio: event loops, coroutines, connection pooling", type: "topic", refId: "py-asyncio" }
{ text: "Implement a thread-safe LRU with TTL from scratch", type: "custom",
  checklist: ["**Data structure.** hash map + doubly linked list for O(1) ops", "**Thread safety.** guard mutations with a lock"] }
```

**Hard rule:** every `dsa` / `system` / `lld` / `problem` / `topic` `refId` must resolve to a real ID.

- `dsa` / `system` / `lld` pages are **fixed** — never invent those IDs. If a role needs something with no matching core page, do NOT force it into those types.
- `topic` references a **shared, extensible library** (`DATA_TOPICS` in `data_topics.js`) — exactly like `DATA_PROBLEMS`. Specialized, *reusable* concepts (Python internals, GenAI/LLM systems, AI security, MLOps/deployment, data/distributed extras) belong here: reference an existing topic, or add a new one first (see Phase 3b) so every future job reuses the same authored explanation and visualization. **Prefer a `topic` over a `custom` for anything a candidate should learn.**
- Reserve `custom` for genuinely **one-off, non-reusable** work — hands-on exercises ("implement X from scratch", "code a worker queue"), behavioral drafting, and timed mocks. Give each `custom` an optional `checklist` ("what good looks like") so it still teaches, but do not author a diagram for a pure to-do.

## Valid reference IDs

Confirm the current sets before planning (they may have grown), then only use IDs from them:

```bash
# DSA pattern ids
grep -oE 'id: "[a-z0-9-]+"' webapp/data_dsa.js
# HLD topic + case ids
grep -oE 'id: "[a-z0-9-]+"' webapp/data_system.js
# LLD topic + case ids
grep -oE 'id: "[a-z0-9-]+"' webapp/data_lld.js
# Specialized topic ids (shared, extensible library)
grep -oE '"[a-z0-9-]+":\s*\{' webapp/data_topics.js
# Existing problem ids
grep -oE '"[a-z0-9-]+":' webapp/data_problems.js
```

Snapshot at time of writing (verify with the commands above):

- **DSA** (`data_dsa.js`): `coding-playbook`, `arrays-hashing`, `two-pointers`, `sliding-window`, `stack`, `binary-search`, `linked-list`, `trees`, `tries`, `heap`, `backtracking`, `graphs`, `matrix-grids`, `adv-graphs`, `dp-1d`, `dp-2d`, `greedy`, `intervals`, `bits`, `design`
- **HLD** (`data_system.js`): `sd-framework`, `sd-estimation`, `sd-loadbalancing`, `sd-caching`, `sd-database`, `sd-sql-nosql`, `sd-cap`, `sd-consistent-hashing`, `sd-queues`, `sd-cdn-storage`, `sd-ratelimit-api`, `sd-observability`, `sd-realtime`, `sd-transactions`, `sd-auth`, and cases `case-url-shortener`, `case-rate-limiter`, `case-kv-store`, `case-chat`, `case-newsfeed`, `case-video`, `case-notifications`, `case-typeahead`, `case-rag`, `case-llm-serving`
- **LLD** (`data_lld.js`): `lld-approach`, `lld-solid`, `lld-patterns-core`, `lld-concurrency`, and cases `lld-parking`, `lld-vending`, `lld-elevator`, `lld-splitwise`, `lld-bookmyshow`, `lld-snake-ladder`, `lld-logger`, `lld-ride-hailing`
- **Specialized topics** (`data_topics.js`, extensible — add to it when a reusable concept is missing): Python internals `py-memory-model`, `py-concurrency`, `py-asyncio`; GenAI/LLM `vector-db-indexes`, `rag-ingestion-chunking`, `knowledge-graphs-semantic-search`, `agent-orchestration`, `multi-agent-systems`, `llm-serving-economics`, `agent-guardrails`; AI security `rag-acl-security`, `prompt-injection-security`; MLOps/deployment `model-compression-quant`, `mlops-llmops-eval`, `containerization-k8s`, `cloud-native-deployment`; data/distributed `data-pipeline-patterns`

## Procedure

### Phase 1 — Establish inputs (job description + duration)
Get the full JD text. Extract: company, title, level (SDE-2 / Senior / Staff…), primary languages, core system areas (distributed systems, streaming, storage, realtime, etc.), any specialized domain (GenAI/RAG, cloud, data pipelines, mobile…), and the preferred qualifications. These signals drive emphasis and phase ordering.

Then confirm the **preparation duration** (see Inputs). Normalize it to a phase count `N` and a phase unit before planning — if it was not given, ask now. `N` is the exact number of entries you will put in the `weeks` array.

### Phase 2 — Map requirements to the libraries
Sort the needs into DSA, HLD, LLD, specialized concepts, and coding problems, then map each to an existing ID:

- Core algorithm/architecture needs → `dsa` / `system` / `lld` (fixed IDs).
- A specialized *concept a candidate should learn* (language internals, GenAI/LLM, AI security, MLOps, cloud, data pipelines…) → a `topic` from `DATA_TOPICS`. Reuse an existing topic if one fits; otherwise add it in Phase 3b. This is the default for role-specific knowledge — it is reusable across every future job.
- A one-off *hands-on exercise* with nothing reusable to teach (implement/code/design X, draft STAR stories, run a mock) → a `custom` item with a short `checklist`.

### Phase 3 — Add any missing coding problems
Pick the problems the loop is likely to test. For any not already in `DATA_PROBLEMS`, add them to `webapp/data_problems.js` with a unique kebab-case key and:

```js
"problem-id": { name: "Display Name", diff: "E" | "M" | "H", url: "https://leetcode.com/problems/.../", pattern: "<dsa-pattern-id>" }
```

Use real LeetCode URLs and a `pattern` that is a valid DSA id. Do not duplicate an existing problem under a new key — reuse the existing key.

### Phase 3b — Add any missing specialized topics
For each specialized concept the role needs that has no existing `topic`, add it to `DATA_TOPICS.topics` in `webapp/data_topics.js` (keyed by a unique kebab-case id) so it becomes reusable:

```js
"topic-id": {
  name: "Display Name",
  category: "<one of DATA_TOPICS.categories[].id>",   // add a new category object if none fits
  summary: "One-line what/why.",
  visual: `<div class="sdd"><div class="viz-label">caption</div><div class="frow"><span class="nd nd-c">A</span><span class="fa">&rarr;</span><span class="nd nd-s">B</span></div><div class="viz-note"><small>note</small></div></div>`,
  details: [ "**Lead.** point one.", "**Lead.** point two." ]
}
```

Rules for topic content:
- **`visual`** is injected as raw HTML — reuse the site's existing viz classes (`.sdd` `.viz-label` `.frow` `.nd`/`nd-c`/`nd-e`/`nd-s`/`nd-d`/`nd-q` `.fa` `.viz-note` `.duo` `.viz-bars`/`.ibar` `.frow-sub`). Do not invent CSS classes and do not embed external assets. `<small>`/`<em>`/`<strong>` are fine here. Encode arrows as HTML entities (`&rarr;`, `--&gt;`).
- **`details`** render through `md()`, which supports **only** `**bold**` and `` `code` `` — no other markdown. Do NOT use `*italic*`, `[[wikilinks]]`, markdown links, or raw HTML tags in `details` (they will show literally). Cross-reference sibling topics in plain prose ("see the Python Concurrency topic").
- Reuse before adding: check the snapshot / grep first so two jobs share one topic instead of duplicating it.

Do not duplicate an existing topic under a new key — reference the existing id.

### Phase 4 — Build the curriculum sized to the duration
Produce exactly `N` phases (the count normalized in Phase 1). The arc always reads "from starting to cracking" — foundations and core patterns first, then HLD/LLD and role-specific depth, closing with behavioral (STAR) prep and timed mocks — but how much fits depends on `N`. Allocate roughly: first ~15% foundations, ~45% DSA patterns + problems, ~25% HLD/LLD + role-specific depth, final ~15% behavioral and mock loops. Never drop the closing mock/STAR phase, however short the window.

Scale the content, not just the phase count:

| Window            | Coverage strategy                                                                                     | Per-phase load                                  |
|-------------------|-------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| **Short** (≤ 4 wk / days) | Only the highest-signal areas from the JD. Merge or skip low-priority patterns. Foundations compressed into the first sprint. One consolidated mock at the end. | 1-2 reviews + 1-2 must-do problems + 1 role `topic`/`custom` |
| **Standard** (5-10 wk) | Cover all core patterns the role needs, main HLD topics, key LLD, and the role's specialized domain. | 2-3 reviews + 2-3 problems + 1-2 role `topic`/`custom`  |
| **Long** (11+ wk)  | Full breadth plus depth: extra problems per pattern, more HLD/LLD cases, dedicated revision phases, and 2+ mock rounds. | 3-4 reviews + 3+ problems + 1-2 role `topic`/`custom`   |

When the window is too short to cover everything the JD implies, prioritize by what the loop most likely tests (coding + the role's core system area) and say in the Phase 7 summary what you deferred. Each phase gets a `title`, a one-line `desc`, and its `items` mix. Favor `topic` items for the role's specialized knowledge so each phase links to a learnable, visualized page rather than a dead-end task.

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
Give the user: the job title and ID added, the total duration the plan fits (`N` phases over the requested window), the per-phase themes in one line each, the count of new problems and new specialized topics introduced, anything you deferred because the window was tight, and a pointer to open the **Company Prep** tab (`webapp/index.html`) and select this path to start studying. Note that `topic` items expand inline ("Show notes") with a visualization, and `custom` exercises expand to a checklist.

## Guardrails

- Honor the requested preparation duration: the `weeks` array must have exactly `N` entries. If no duration was given, ask before planning (default 12 weeks).
- Never invent `dsa`/`system`/`lld` IDs; use only IDs confirmed to exist. A specialized reusable concept is a `topic` (add it to `data_topics.js` if missing); only a one-off exercise is a `custom`.
- Every `problem` refId must exist in `DATA_PROBLEMS`, and every `topic` refId must exist in `DATA_TOPICS.topics` — add the missing entry first if needed. Reuse existing topics before adding new ones.
- When adding a topic: `category` must be a declared `DATA_TOPICS.categories[].id` (the validator enforces this); `details` use only `**bold**` and `` `code` ``; `visual` reuses existing viz CSS classes only.
- `data_topics.js`, `data_problems.js`, and `data_custom.js` are already wired into `index.html`, so adding a topic or problem needs no new script tag (only a new per-job `custom_paths/<slug>.js` file does).
- Preserve all pre-existing paths, problems, and topics; this skill only adds. Never edit another job's file in `custom_paths/`.
- One job per file in `webapp/custom_paths/`; never append a new job into `webapp/data_custom.js` (it stays the empty-container stub) or into another job's file.
- `diff` is exactly one of `"E"`, `"M"`, `"H"`.
- No emojis in code, data, comments, or the summary.
- The validator must pass before you report done.
