---
name: job_roadmap_curator
description: Triggered when the user requests to curate, analyze, or generate a custom preparation roadmap for a specific job ID (e.g. from an Adobe, Google, or other careers URL).
---

# Job Roadmap Curator Skill

This skill guides the agent in automatically generating and integrating a customized week-by-week interview preparation roadmap for any target job ID or careers posting.

## Execution Procedure

When this skill is triggered, execute the following steps in sequence:

### Phase 1: Retrieve Job Details
1. Locate the careers URL or job posting details.
2. If only a job ID or partial description is provided, run a web search using the search tools or fetch the page content to obtain the full text of the job description.
3. Identify the key parameters:
   - Target Job ID (used as the primary key in the dataset)
   - Job Title and Company
   - Experience Level (e.g., SDE-2, Senior, Tech Lead)
   - Primary programming languages (e.g., Python, Java, Go)
   - Required system architectures (e.g., RAG, distributed systems, streaming)
   - Preferred qualifications or specialized frameworks

### Phase 2: Analyze and Map prep requirements
1. Categorize the preparation needs into:
   - Core Data Structures and Algorithms (DSA)
   - High-Level System Design (HLD)
   - Low-Level Object Oriented Design (LLD)
   - Specialized domains (e.g., Generative AI, cloud platforms, data pipelines)
2. Compare the required skills with the existing codebase libraries:
   - Map DSA patterns against `DATA_DSA.patterns` in `website/data_dsa.js`
   - Map HLD fundamentals or cases against `DATA_SYSTEM.sdFundamentals` and `DATA_SYSTEM.sdCases` in `website/data_system.js`
   - Map LLD fundamentals or cases against `DATA_LLD.lldFundamentals` and `DATA_LLD.lldCases` in `website/data_lld.js`

### Phase 3: centralize coding problems
1. Check the target coding problems required for the job.
2. If the problems are not already present in the global problems registry (`website/data_problems.js`), define them there using clean, unique kebab-case IDs.
3. Include metadata for each new problem:
   - `name`: Display name
   - `diff`: Difficulty ("E", "M", or "H")
   - `url`: Direct LeetCode problem link
   - `pattern`: The relevant DSA pattern identifier

### Phase 4: Construct the 12-Week Custom Curriculum
1. Plan a structured 12-week curriculum mapping out a path from basics to advanced.
2. For each week, define:
   - `title`: Title of the week
   - `desc`: A short description of the weekly focus
   - `items`: An array of targets.
3. Map items to their correct types and reference IDs:
   - `{ text: "...", type: "dsa", refId: "pattern-id" }`
   - `{ text: "...", type: "system", refId: "hld-topic-id" }`
   - `{ text: "...", type: "lld", refId: "lld-topic-id" }`
   - `{ text: "...", type: "problem", refId: "problem-id" }`
   - `{ text: "...", type: "custom" }` (for topics specific to this role that do not map to standard core categories)

### Phase 5: Integrate and Write Data
1. Modify `website/data_custom.js` to insert the new job ID under `DATA_CUSTOM.paths`.
2. Ensure you preserve all existing job paths in `DATA_CUSTOM.paths` without overwriting them.
3. Save the modified file.

### Phase 6: Validate the Changes
1. Run the local Node.js validator script using the workspace command:
   ```powershell
   node .agents/skills/job_roadmap_curator/scripts/validate.js
   ```
2. Verify that the output returns `SUCCESS: All custom path references are valid!`.
3. If any reference is missing or typed incorrectly, fix the reference and re-run the validator.

### Phase 7: Present Summary
1. Provide a concise summary of the generated curriculum.
2. List the key week themes.
3. Point to the "Company Prep" tab in the web application for active study.
