# FAANG Prep 2026 — 12-Week SDE-2 Interview Prep Platform

Welcome to the **FAANG Prep 2026** workspace. This repository is a self-contained, highly interactive study engine and playground designed to systematically prepare you for Software Development Engineer II (SDE-2) loops at Tier-1 tech companies.

It combines an **interactive front-end study dashboard** with a **Python sandbox environment** to run, profile, and experiment with algorithmic patterns and system components.

---

## Project Overview

This workspace is split into two primary layers:

1. **The Interactive Web Platform (`/website`)**:
   - A modern client-side application built with semantic HTML, vanilla CSS, and JavaScript.
   - Houses a **12-Week Curriculum Roadmap** specifically tailored for SDE-2 expectations (focused on autonomy, design trade-offs, and behavioral signals).
   - Contains a built-in **Spaced Repetition Scheduler** (leveraging `localStorage`) to schedule topic reviews at **1, 3, 7, 14, and 35-day intervals**.

2. **The Algorithmic Playground (`/`)**:
   - A Python environment powered by `uv` for lightning-fast package management and execution.
   - Includes real-world execution scripts (e.g., [big_o.py](file:///e:/Development/interview_prep/big_o.py)) comparing recursive, memoized, and cached dynamic programming paradigms to visualize time and space complexity differences.

---

## Repository Structure

```plaintext
interview_prep/
├── .python-version      # Specifies the active Python environment version
├── pyproject.toml       # Python project configuration and dependency settings
├── uv.lock              # Lockfile for reproducible Python dependencies
├── main.py              # Entrypoint script for local python sandbox executions
├── big_o.py             # Big-O complexity analysis and memoization playground
├── result.json          # Execution tracing and profiling outputs
└── website/             # Standalone SPA (Single Page Application) for FAANG Prep
    ├── index.html       # Application entry shell and layout structure
    ├── styles.css       # Clean, modern design with dark/light themes & fluid layout
    ├── app.js           # Core DOM coordinator, revision engine, and state machine
    ├── data.js          # Curriculum data orchestrator
    ├── data_dsa.js      # Data Structures & Algorithms patterns and templates
    ├── data_system.js   # System Design fundamentals and case studies
    ├── data_lld.js      # Low-Level Design (SOLID, design patterns, machine coding)
    └── data_misc.js     # Behavioral patterns (STAR), roadmaps, and scheduling settings
```

---

## Technical Content Breakdown

### 1. Interactive Study Modules (Web UI)
* **Dashboard**: Tracks overall curriculum completion progress, daily/weekly streak charts, active review backlog, and current study goals.
* **Roadmap**: A weekly breakdown mapping out exactly what to study during the 12-week SDE-2 prep schedule.
* **DSA Patterns**: Practical coding frameworks, recognizing guidelines, modular code templates, complexities, and common pitfalls.
* **HLD (High-Level Design)**: Crucial system design concepts (Sharding, Load Balancers, Caching, Consensus, SQL vs NoSQL) and case studies (e.g., Ticketmaster, TinyURL).
* **LLD (Low-Level Design)**: SOLID principles, design pattern blueprints, and machine coding case studies (e.g., Parking Lot, Movie Ticket Booking).
* **Behavioral**: Guidelines on structuring stories using the **STAR method** highlighting SDE-2 signals like *Autonomy*, *Ambiguity*, *Mentorship*, and *Quantified Business & Technical Impact*.
* **Revision**: Displays items currently due for review using a **Leitner-based Spaced Repetition System (SRS)**.

### 2. Python Complexity Playground
The repository includes practical examples demonstrating time and space complexities. For example, in [big_o.py](file:///e:/Development/interview_prep/big_o.py), three implementations of the Fibonacci sequence are analyzed:
* **Standard Recursion**: $O(2^n)$ time, demonstrating exponential growth and call stack overhead.
* **Top-Down Memoization**: $O(n)$ time and $O(n)$ space, using a custom hash map dictionary.
* **In-built Caching (`lru_cache`)**: $O(n)$ time, utilizing Python's built-in memoization decorator.

---

## Getting Started

### Running the Web Platform
You do not need to compile or build any assets to run the web application. You can view it in two ways:

1. **Directly**: Open [website/index.html](file:///e:/Development/interview_prep/website/index.html) in any modern web browser.
2. **Local Server** (Recommended for file access/stability):
   Run Python's built-in HTTP server from the project directory:
   ```powershell
   python -m http.server 8000
   ```
   Then navigate to `http://localhost:8000/website/` in your browser.

### Running Python Algorithms
The sandbox uses `uv` for workspace management. Ensure you have `uv` installed, or use standard Python 3.12+.

1. Run the default entrypoint:
   ```powershell
   python main.py
   ```
2. Execute the Big-O visual analyzer:
   ```powershell
   python big_o.py
   ```

---

## Spaced Repetition Engine Mechanics

Your progress is automatically saved to the browser's `localStorage` under the `faangPrep2026` namespace. 
Whenever you mark a pattern or design concept as **"Learned"**:
1. It is scheduled for its first review in **1 day**.
2. When reviewed successfully, the stage increments, pushing the next review to **3 days**, then **7 days**, **14 days**, and finally **35 days** (Mastered).
3. If you struggle or reset the topic, you can reset the intervals to rebuild your memory pathways.
