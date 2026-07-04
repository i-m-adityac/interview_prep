// ============================================================
// FAANG Prep 2026 — Miscellaneous Data
// ============================================================

const DATA_MISC = {
  intervals: [1, 3, 7, 14, 35],
  resources: {
    dsa: [
      { name: "NeetCode roadmap", url: "https://neetcode.io/roadmap" },
      { name: "Tech Interview Handbook", url: "https://www.techinterviewhandbook.org/" },
      { name: "LeetCode problemset", url: "https://leetcode.com/problemset/" }
    ],
    system: [
      { name: "Hello Interview — SD in a Hurry", url: "https://www.hellointerview.com/learn/system-design/in-a-hurry/introduction" },
      { name: "System Design Primer (GitHub)", url: "https://github.com/donnemartin/system-design-primer" },
      { name: "ByteByteGo (Alex Xu)", url: "https://blog.bytebytego.com/" }
    ],
    lld: [
      { name: "Refactoring.Guru — Design Patterns", url: "https://refactoring.guru/design-patterns" },
      { name: "Awesome Low-Level Design (GitHub)", url: "https://github.com/ashishps1/awesome-low-level-design" },
      { name: "workat.tech — Machine Coding", url: "https://workat.tech/machine-coding" }
    ],
    behavioral: [
      { name: "Amazon Leadership Principles", url: "https://www.amazon.jobs/content/en/our-workplace/leadership-principles" },
      { name: "Jeff H Sipe — behavioral practice", url: "https://www.youtube.com/@jeffhsipepi" }
    ]
  },
  behavioral: {
    intro: "At SDE-2, behavioral rounds carry real weight — Amazon's is essentially half the loop. In 2026, poor communication is the most-cited rejection reason across FAANG. The fix is preparation, not charisma: 8 prepared stories cover ~90% of all questions asked.",
    star: [
      "**S — Situation (2-3 sentences).** Context and stakes. Name the scale: “our checkout service, ~40K orders/day”.",
      "**T — Task (1-2 sentences).** YOUR responsibility specifically — not the team's.",
      "**A — Action (the bulk, 60%).** What YOU did, step by step, including the decision points and why you chose as you did. “I” not “we”. Technical depth welcome.",
      "**R — Result (2-3 sentences).** Quantify: latency down 40%, saved 10 hrs/week, shipped 2 weeks early. Then one sentence of what you learned or would do differently — this upgrade separates good answers from great ones.",
      "**Timing:** 2-3 minutes per answer, then stop talking. Rambling past the result is the most common behavioral failure.",
      "**SDE-2 Signal — Autonomy:** Frame your Action around how you personally drove a solution from ambiguous requirements to execution without constant supervisor oversight.",
      "**SDE-2 Signal — Ambiguity:** Show that you can structure a vague request, identify key stakeholders, ask the right questions, and make technical decisions based on metrics and tradeoffs.",
      "**SDE-2 Signal — Mentorship:** Highlight how you actively unblocked teammates, conducted code reviews, or built testing frameworks and documentations to level up your team's velocity.",
      "**SDE-2 Signal — Business & Technical Impact:** The Result must be quantified in terms of business or system metrics. Latency down (e.g., 'p99 < 150ms'), storage savings (e.g., 'saved $5K/mo'), or developer velocity (e.g., 'CI build times down 20%')."
    ],
    stories: [
      { id: "story-impact", name: "Biggest technical achievement", hint: "Your flagship story. High complexity, measurable impact, clear personal ownership. Covers: 'most proud of', 'complex problem', 'dive deep'." },
      { id: "story-conflict", name: "Disagreement with a colleague/manager", hint: "Show you disagreed on substance, sought data, committed to the outcome either way. Covers: 'conflict', 'disagree and commit', 'influenced without authority'." },
      { id: "story-failure", name: "A real failure", hint: "Pick a genuine failure (not 'I work too hard'), own it without blaming, show the systemic fix you made. Covers: 'failure', 'mistake', 'what would you do differently'." },
      { id: "story-deadline", name: "Tight deadline / pressure", hint: "Show prioritization and scope-cutting, communicating risk early, and what you deliberately dropped. Covers: 'deadline', 'prioritization', 'deliver results'." },
      { id: "story-ambiguity", name: "Ambiguous problem you structured", hint: "You received vagueness and produced clarity: asked the right questions, defined milestones, made a call with incomplete data. Covers: 'ambiguity', 'bias for action'." },
      { id: "story-growth", name: "Learning something fast / feedback", hint: "New tech or domain under time pressure, or hard feedback you actually acted on. Covers: 'learn and be curious', 'received criticism'." },
      { id: "story-mentoring", name: "Helping someone else succeed", hint: "Mentoring a junior, unblocking a teammate, improving team process. Covers: 'leadership', 'hire and develop', 'team player'." },
      { id: "story-customer", name: "Going deep for a user/customer", hint: "You traced a real user pain to a root cause and fixed it beyond your job description. Covers: 'customer obsession', 'ownership', 'going above and beyond'." }
    ],
    principles: [
      { name: "Customer Obsession", tip: "Frame decisions as starting from user pain, working backwards." },
      { name: "Ownership", tip: "You acted beyond your job description; never 'that wasn't my job'." },
      { name: "Dive Deep", tip: "You personally read the logs/data; metrics at your fingertips." },
      { name: "Bias for Action", tip: "Reversible decisions made quickly; calculated risk with a rollback plan." },
      { name: "Disagree & Commit", tip: "Argued with data, lost, then executed the other plan wholeheartedly." },
      { name: "Deliver Results", tip: "Numbers. Every story ends in a measurable outcome." },
      { name: "Earn Trust", tip: "Admitted a mistake publicly; gave credit; candid status reporting." },
      { name: "Invent & Simplify", tip: "You removed complexity or found the boring-but-better solution." }
    ],
    questions: [
      "Tell me about yourself (90-second pitch: current role → 2 highlights with numbers → why this company).",
      "Tell me about your most technically challenging project.",
      "Tell me about a time you disagreed with your manager.",
      "Tell me about a time you failed. What did you learn?",
      "Tell me about a time you had to deliver with incomplete requirements.",
      "Tell me about a time you received difficult feedback.",
      "Tell me about a time you went above and beyond for a customer/user.",
      "Tell me about a time you had to convince a team to change direction.",
      "Why do you want to work here? (Research the company; name specific products/tech.)",
      "Do you have questions for me? (Always have 2-3: team charter, on-call reality, how success is measured.)"
    ]
  },
  roadmap: [
    {
      week: 1, phase: 1, theme: "Foundations: Big-O + Arrays & Hashing",
      patternIds: ["coding-playbook", "arrays-hashing"],
      goals: [
        { id: "w1-playbook", text: "Study the Coding Round Playbook (visual + execution steps) and mark it learned" },
        { id: "w1-bigo", text: "Review Big-O: be able to state time/space of every solution you write, unprompted" },
        { id: "w1-pattern", text: "Study Arrays & Hashing pattern page (visual + all 3 templates) and mark it learned" },
        { id: "w1-problems", text: "Solve 10-12 problems from the pattern list (start with all Easies)" },
        { id: "w1-narrate", text: "Habit from day 1: talk out loud while solving — brute force first, then optimize" },
        { id: "w1-setup", text: "Set up: LeetCode account, a solution journal (one note per problem: pattern, trick, mistake)" }
      ]
    },
    {
      week: 2, phase: 1, theme: "Two Pointers + Sliding Window",
      patternIds: ["two-pointers", "sliding-window"],
      goals: [
        { id: "w2-tp", text: "Learn Two Pointers (converging + fast/slow templates), solve 5-6 problems" },
        { id: "w2-sw", text: "Learn Sliding Window (variable + fixed templates), solve 5-6 problems" },
        { id: "w2-derive", text: "Re-derive both templates from memory on paper (blurting) at week's end" },
        { id: "w2-review", text: "Clear your revision queue every day this week (it starts filling now)" }
      ]
    },
    {
      week: 3, phase: 1, theme: "Stack + Binary Search",
      patternIds: ["stack", "binary-search"],
      goals: [
        { id: "w3-stack", text: "Learn Stack & Monotonic Stack, solve 5-6 problems (Daily Temperatures is the key one)" },
        { id: "w3-bs", text: "Learn Binary Search — drill the first_true template until automatic, solve 5-6 problems" },
        { id: "w3-soa", text: "Do 2 'search on answer' problems (Koko Bananas + one more) — the FAANG favorite reframe" },
        { id: "w3-timed", text: "First timed solve: one Easy in 15 min, one Medium in 30 min, with a real clock" }
      ]
    },
    {
      week: 4, phase: 1, theme: "Linked Lists + Consolidation",
      patternIds: ["linked-list"],
      goals: [
        { id: "w4-ll", text: "Learn Linked List moves (dummy head, fast/slow, reversal), solve 6-7 problems including LRU Cache" },
        { id: "w4-consol", text: "Consolidation: re-solve 5 problems you found hardest in weeks 1-3, from scratch, no peeking" },
        { id: "w4-mock1", text: "MOCK #1: one full 45-min session — 2 problems, timed, thinking out loud (record yourself or use a friend/AI)" },
        { id: "w4-retro", text: "Write a retro: which patterns are weak? Adjust week 5-6 problem choices accordingly" }
      ]
    },
    {
      week: 5, phase: 2, theme: "Trees + System Design begins",
      patternIds: ["trees"],
      sdIds: ["sd-framework", "sd-estimation", "sd-loadbalancing"],
      goals: [
        { id: "w5-trees", text: "Learn Trees (DFS 'ask the subtree' + BFS levels + BST range trick), solve 7-8 problems" },
        { id: "w5-sd1", text: "Weekend SD session 1 (90 min): Interview Framework + Back-of-Envelope — do 3 practice estimations" },
        { id: "w5-sd2", text: "Weekend SD session 2 (60 min): Load Balancing & stateless services" },
        { id: "w5-queue", text: "Revision queue is real now — 20-30 min daily, treat it as non-negotiable" }
      ]
    },
    {
      week: 6, phase: 2, theme: "Tries + Heaps · SD: Databases",
      patternIds: ["tries", "heap"],
      sdIds: ["sd-caching", "sd-database"],
      goals: [
        { id: "w6-trie", text: "Learn Tries, implement one from scratch without reference, solve 2-3 problems" },
        { id: "w6-heap", text: "Learn Heap patterns (k-of-n + two-heaps median), solve 5-6 problems" },
        { id: "w6-sd", text: "Weekend SD (2 × 75 min): Caching (stampedes, invalidation) + DB Replication & Sharding" },
        { id: "w6-draw", text: "Draw from memory: cache-aside flow + primary-replica failover. Blurting works for diagrams too" }
      ]
    },
    {
      week: 7, phase: 2, theme: "Backtracking + Graphs · HLD: Consistency · LLD begins",
      patternIds: ["backtracking", "graphs", "matrix-grids"],
      sdIds: ["sd-sql-nosql", "sd-cap"],
      lldIds: ["lld-approach", "lld-solid"],
      goals: [
        { id: "w7-bt", text: "Learn Backtracking (choose-explore-unchoose), solve 5-6 problems" },
        { id: "w7-graph", text: "Learn Graph BFS/DFS (islands, flood fill, multi-source BFS), solve 5-6 problems" },
        { id: "w7-matrix", text: "Learn Matrix & 2D Grids pattern (copy traps, boundaries), solve 2-3 problems" },
        { id: "w7-sd", text: "Weekend HLD (2 × 75 min): SQL vs NoSQL + CAP & consistency models" },
        { id: "w7-case1", text: "First HLD case study: URL Shortener — read it, then redo the whole design alone on paper" },
        { id: "w7-lld", text: "LLD kickoff (45 min): **How LLD rounds work** + **SOLID** — then spot one SOLID violation in your own past code" }
      ]
    },
    {
      week: 8, phase: 2, theme: "Advanced Graphs + Mock · HLD: Distribution · LLD: Patterns",
      patternIds: ["adv-graphs"],
      sdIds: ["sd-consistent-hashing", "sd-queues"],
      lldIds: ["lld-patterns-core"],
      goals: [
        { id: "w8-adv", text: "Learn Topo Sort, Union-Find, Dijkstra — implement each once from scratch, solve 5-6 problems" },
        { id: "w8-sd", text: "Weekend HLD: Consistent Hashing + Message Queues, then case study: Rate Limiter" },
        { id: "w8-lld", text: "LLD: the six core patterns — re-code the Strategy + Factory snippet from memory" },
        { id: "w8-mock2", text: "MOCK #2: 45-min coding (2 mediums, timed, narrated). Compare against week-4 retro — measure progress" },
        { id: "w8-behav", text: "Behavioral start: read the STAR page, pick your 8 stories, draft bullet outlines for 3 of them" }
      ]
    },
    {
      week: 9, phase: 3, theme: "1-D DP + Greedy · HLD: Chat · LLD: First full rep",
      patternIds: ["dp-1d", "greedy"],
      sdIds: ["sd-realtime"],
      lldIds: ["lld-parking", "lld-snake-ladder"],
      goals: [
        { id: "w9-dp", text: "Learn 1-D DP with the 5-step workflow (brute force → memo → table), solve 6-7 problems" },
        { id: "w9-greedy", text: "Learn Greedy + exchange-argument justification, solve 4-5 problems" },
        { id: "w9-sd", text: "Weekend HLD: Realtime Delivery fundamentals, then Chat System — study it, redesign from a blank page in 40 min" },
        { id: "w9-lld", text: "LLD: **Parking Lot** as a full 90-min machine-coding rep (runnable code + demo) · **Snake & Ladder** as a 30-min warm-up" },
        { id: "w9-stories", text: "Behavioral: finish drafting all 8 stories in the Story Builder, with numbers in every Result" }
      ]
    },
    {
      week: 10, phase: 3, theme: "2-D DP + Intervals · SD: Feed & Video",
      patternIds: ["dp-2d", "intervals"],
      sdIds: ["sd-cdn-storage"],
      goals: [
        { id: "w10-dp2", text: "Learn 2-D DP (LCS + knapsack shapes), solve 5-6 problems, hand-fill one table on paper" },
        { id: "w10-int", text: "Learn Intervals (merge sweep + meeting rooms), solve 4 problems" },
        { id: "w10-sd", text: "Weekend SD: CDN & storage fundamentals, then cases: News Feed AND Video Platform" },
        { id: "w10-mock3", text: "MOCK #3: full system design mock — 45 min, one case you haven't studied, out loud, on a whiteboard/excalidraw" }
      ]
    },
    {
      week: 11, phase: 3, theme: "Hard Mix + AI Systems + Behavioral polish",
      patternIds: ["bits", "design"],
      sdIds: ["sd-ratelimit-api", "sd-observability"],
      goals: [
        { id: "w11-mix", text: "Mixed practice: 8-10 problems ACROSS patterns without being told the pattern — recognition training" },
        { id: "w11-design", text: "Learn Design Problems (LRU from scratch) + Bit Manipulation basics" },
        { id: "w11-ai", text: "Weekend SD: RAG pipeline + LLM serving cases, plus Observability & Resilience — the 2026 differentiators" },
        { id: "w11-behav", text: "Behavioral: rehearse all 8 stories OUT LOUD at 2-3 min each; do one behavioral mock" },
        { id: "w11-cases", text: "SD cases: KV Store + Notification System + Typeahead (read + one blank-page redo)" }
      ]
    },
    {
      week: 12, phase: 3, theme: "Mock Week + Taper",
      patternIds: [],
      goals: [
        { id: "w12-mocks", text: "4 mocks this week: 2 coding (timed, narrated), 1 system design, 1 behavioral — simulate the real loop" },
        { id: "w12-queue", text: "Clear the entire revision queue; re-derive every pattern template from memory one final time" },
        { id: "w12-company", text: "Company-specific: research your target's process (levels.fyi, Blind, Glassdoor recent reports), tune accordingly" },
        { id: "w12-logistics", text: "Logistics: 90-second intro polished, questions-for-interviewer ready, setup tested for virtual onsites" },
        { id: "w12-taper", text: "Taper: light review only in the final 2 days — sleep is better prep than one more hard problem" }
      ]
    }
  ],
  dailyPlan: [
    { time: "0:00 – 0:45", title: "Learn (visual first)", desc: "Study the current week's pattern/topic page: read the visual, hand-trace it, then read the template and re-type it without looking." },
    { time: "0:45 – 1:45", title: "Solve (timed)", desc: "2 problems from the current pattern. 25-30 min cap each; narrate out loud; if stuck at 30 min, read the solution, close it, re-code from memory." },
    { time: "1:45 – 2:15", title: "Revise (spaced repetition)", desc: "Clear today's revision queue: re-derive each due template from memory, re-solve one old problem cold. This 30 min is where retention actually happens." }
  ],
  weekendPlan: [
    { time: "Session A (90 min)", title: "System design deep dive", desc: "Weeks 5+: study the scheduled fundamentals/case, then redraw the whole design from a blank page." },
    { time: "Session B (60 min)", title: "Weekly review", desc: "Re-solve the week's 2 hardest problems cold; update your solution journal; scan the next week's plan." }
  ]
};
