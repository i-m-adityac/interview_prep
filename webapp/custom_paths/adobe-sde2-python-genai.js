// ============================================================
// FAANG Prep 2026 — Custom Path: Adobe SDE-2 (Python & Gen AI)
// ============================================================

DATA_CUSTOM.paths["ADOBUSR169874EXTERNALENUS"] = {
  jobTitle: "Adobe SDE-2 (Python & Gen AI)",
  jobUrl: "https://careers.adobe.com/us/en/job/ADOBUSR169874EXTERNALENUS/SDE-2-Python-Gen-AI?utm_source=linkedin&utm_medium=phenom-feeds&source=LinkedIn",
  weeks: [
    {
      title: "Week 1: Algorithmic Foundations & Python Basics",
      desc: "Set the coding round baseline and understand advanced Python memory structures.",
      items: [
        { text: "Study the Coding Round Playbook to structure your interview communication", type: "dsa", refId: "coding-playbook" },
        { text: "Review Arrays & Hashing pattern templates and pitfalls", type: "dsa", refId: "arrays-hashing" },
        { text: "Solve 'Two Sum' problem", type: "problem", refId: "two-sum" },
        { text: "Solve 'Group Anagrams' problem", type: "problem", refId: "group-anagrams" },
        { text: "Solve 'Longest Consecutive Sequence' problem", type: "problem", refId: "longest-consecutive-sequence" },
        { text: "Study the Python memory model: reference counting, cyclic GC, and __slots__", type: "topic", refId: "py-memory-model" }
      ]
    },
    {
      title: "Week 2: Linear Data Structures, Concurrency & Caching",
      desc: "Master two-pointer traversals and initial caching architecture concepts.",
      items: [
        { text: "Review Two Pointers pattern templates and search space reduction", type: "dsa", refId: "two-pointers" },
        { text: "Review Sliding Window variable-size and fixed-size templates", type: "dsa", refId: "sliding-window" },
        { text: "Study HLD Caching fundamentals: Cache-aside, stampedes, and eviction policies", type: "system", refId: "sd-caching" },
        { text: "Solve '3Sum' problem", type: "problem", refId: "three-sum" },
        { text: "Solve 'Container With Most Water' problem", type: "problem", refId: "container-with-most-water" },
        { text: "Solve 'Longest Substring Without Repeating Characters' problem", type: "problem", refId: "longest-substring-without-repeating" },
        { text: "Study Python concurrency and the GIL: threading vs multiprocessing vs async", type: "topic", refId: "py-concurrency" }
      ]
    },
    {
      title: "Week 3: Stack, Heaps & Message Queues + Asyncio",
      desc: "Learn about queue structures, scheduling, and asynchronous programming in Python.",
      items: [
        { text: "Review Stack & Monotonic Stack templates", type: "dsa", refId: "stack" },
        { text: "Review Heaps/Priority Queue patterns for streaming and top-k data", type: "dsa", refId: "heap" },
        { text: "Study HLD Message Queues & Async Processing (Kafka vs SQS)", type: "system", refId: "sd-queues" },
        { text: "Solve 'Valid Parentheses' problem", type: "problem", refId: "valid-parentheses" },
        { text: "Solve 'Daily Temperatures' problem", type: "problem", refId: "daily-temperatures" },
        { text: "Solve 'Task Scheduler' problem", type: "problem", refId: "task-scheduler" },
        { text: "Study Python asyncio: event loops, coroutines, and connection pooling", type: "topic", refId: "py-asyncio" }
      ]
    },
    {
      title: "Week 4: Binary Search, Intervals & API Gateways",
      desc: "Prepare for optimal searching and rate-limiting systems.",
      items: [
        { text: "Review Binary Search lower-bound/first-true templates", type: "dsa", refId: "binary-search" },
        { text: "Review Intervals merge-sweep and overlap algorithms", type: "dsa", refId: "intervals" },
        { text: "Study HLD API Design & Rate Limiting algorithms (Token Bucket, sliding logs)", type: "system", refId: "sd-ratelimit-api" },
        { text: "Solve 'Search in Rotated Sorted Array' problem", type: "problem", refId: "search-in-rotated-sorted-array" },
        { text: "Solve 'Merge Intervals' problem", type: "problem", refId: "merge-intervals" },
        {
          text: "Build a distributed Token Bucket rate limiter in Python using Redis for synchronization",
          type: "custom",
          checklist: [
            "**Core algorithm.** Track `tokens` and `last_refill` per key; on each request refill by `elapsed * rate`, cap at burst, allow if `tokens >= 1` then decrement.",
            "**Make it atomic.** Do the read-modify-write in a single Redis Lua script so concurrent requests on the same key cannot race.",
            "**Distributed correctness.** Key by user/tenant/route and store state in Redis so every app instance shares one limiter; set a TTL so idle keys expire.",
            "**Edge cases.** Clock skew across nodes, cost-weighted requests (some cost N tokens), and the response on limit (429 with `Retry-After`).",
            "**Stretch.** Contrast with sliding-window-log and sliding-window-counter; know why token bucket allows bursts while leaky bucket smooths them."
          ]
        }
      ]
    },
    {
      title: "Week 5: Linked Lists, Tries & Distributed Database Scaling",
      desc: "Master key-value designs, custom search structures, and DB partitioning.",
      items: [
        { text: "Review Linked List pointer operations (dummy head, reversal)", type: "dsa", refId: "linked-list" },
        { text: "Review Trie prefix tree structures", type: "dsa", refId: "tries" },
        { text: "Study Database scaling: Replication, master-slave lag, and sharding keys", type: "system", refId: "sd-database" },
        { text: "Study SQL vs NoSQL architectural tradeoffs", type: "system", refId: "sd-sql-nosql" },
        { text: "Study data pipeline patterns: batch vs streaming, idempotent writes, CDC, and schema evolution", type: "topic", refId: "data-pipeline-patterns" },
        { text: "Solve 'LRU Cache' problem", type: "problem", refId: "lru-cache" },
        { text: "Solve 'LFU Cache' problem", type: "problem", refId: "lfu-cache" },
        {
          text: "Implement a thread-safe LRU Cache with TTL expiration from scratch in Python",
          type: "custom",
          checklist: [
            "**Data structure.** Hash map for O(1) lookup plus a doubly linked list (or `OrderedDict`) for O(1) recency updates; move to front on access, evict from the back.",
            "**Add TTL.** Store an expiry timestamp per entry; treat expired entries as misses, evict them lazily, and optionally sweep actively.",
            "**Thread safety.** Guard mutations with a lock (`threading.RLock`) and keep the critical section small; remember the GIL does not make compound operations atomic.",
            "**Capacity policy.** Evict on insert when over capacity; decide whether a `get` on an expired key counts as a miss for stats.",
            "**Test.** Concurrent readers and writers, eviction-order correctness, and TTL expiry under load."
          ]
        }
      ]
    },
    {
      title: "Week 6: Trees, Graphs & Realtime Web Delivery",
      desc: "Learn hierarchical algorithms, graph traversals, and live stream routing.",
      items: [
        { text: "Review Trees (DFS/BFS traversals, range BST tricks)", type: "dsa", refId: "trees" },
        { text: "Review Graph representation and matrix/grid boundary checks", type: "dsa", refId: "graphs" },
        { text: "Review Matrix & 2D Grids traversals", type: "dsa", refId: "matrix-grids" },
        { text: "Study HLD Realtime Delivery: WebSockets, Server-Sent Events (SSE) and polling", type: "system", refId: "sd-realtime" },
        { text: "Solve 'Validate Binary Search Tree' problem", type: "problem", refId: "validate-binary-search-tree" },
        { text: "Solve 'Number of Islands' problem", type: "problem", refId: "number-of-islands" },
        { text: "Solve 'Course Schedule' problem", type: "problem", refId: "course-schedule" }
      ]
    },
    {
      title: "Week 7: Advanced Graph Algorithms & LLD Patterns",
      desc: "Cover advanced routing, SOLID design patterns, and network partitions.",
      items: [
        { text: "Review Advanced Graphs (Dijkstra, Union-Find, Topo Sort)", type: "dsa", refId: "adv-graphs" },
        { text: "Study SOLID Principles in Low-Level Design", type: "lld", refId: "lld-solid" },
        { text: "Study LLD Core Patterns: Strategy, Factory, Observer, and Singleton", type: "lld", refId: "lld-patterns-core" },
        { text: "Study CAP Theorem and Consistency models (strong, linearizable, eventual)", type: "system", refId: "sd-cap" },
        { text: "Study Consistent Hashing ring mechanics and virtual node balance", type: "system", refId: "sd-consistent-hashing" },
        { text: "Solve 'Network Delay Time' problem", type: "problem", refId: "network-delay-time" }
      ]
    },
    {
      title: "Week 8: Generative AI Pipelines & RAG Architecture",
      desc: "Master Vector DB indexing, chunking trade-offs, and document permission rules.",
      items: [
        { text: "Study HLD Case Study: AI RAG Pipeline details", type: "system", refId: "case-rag" },
        { text: "Study Vector Database indexes: HNSW graphs and IVF-PQ quantization", type: "topic", refId: "vector-db-indexes" },
        { text: "Study knowledge graphs and semantic search for enterprise knowledge retrieval", type: "topic", refId: "knowledge-graphs-semantic-search" },
        { text: "Study RAG ingestion and chunking: heading-aware splits, overlap, and CDC sync", type: "topic", refId: "rag-ingestion-chunking" },
        { text: "Study RAG access control: retrieval-time ACL filtering to prevent leaks", type: "topic", refId: "rag-acl-security" },
        {
          text: "Implement a semantic prompt caching layer in Python using vector similarity thresholds",
          type: "custom",
          checklist: [
            "**Idea.** Embed the incoming prompt, search a cache vector store for a near-duplicate above a similarity threshold, and return the stored response on a hit.",
            "**Threshold tuning.** Too low returns wrong answers, too high never hits; calibrate on real traffic and log hit/miss with the similarity score.",
            "**Keying and scope.** Include model, system prompt, and relevant params in the cache key; never share the cache across tenants or permission scopes.",
            "**Invalidation.** TTL plus event-based purge when the underlying knowledge changes; stale cached answers are a correctness bug.",
            "**Measure.** Track hit rate, latency saved, and cost saved; avoid caching non-deterministic or personalized responses."
          ]
        }
      ]
    },
    {
      title: "Week 9: Agentic loops, Orchestration & Model Serving",
      desc: "Learn about autonomous LLM loops, multi-agent frameworks, and GPU serving mechanics.",
      items: [
        { text: "Study HLD Case Study: LLM Inference & Agent Serving Systems", type: "system", refId: "case-llm-serving" },
        { text: "Study agent orchestration: LangChain, LlamaIndex, and LangGraph stateful loops", type: "topic", refId: "agent-orchestration" },
        { text: "Study multi-agent systems: AutoGen conversations and CrewAI role execution", type: "topic", refId: "multi-agent-systems" },
        { text: "Study LLM serving economics: continuous batching, prefill vs decode, and PagedAttention", type: "topic", refId: "llm-serving-economics" },
        { text: "Study agentic guardrails: human-in-the-loop gates, token budgets, and fail-closed limits", type: "topic", refId: "agent-guardrails" }
      ]
    },
    {
      title: "Week 10: LLD / Machine Coding & System Resilience",
      desc: "Build fault-tolerant systems and write production-grade concurrent scripts.",
      items: [
        { text: "Study LLD Concurrency & Thread-safe structures", type: "lld", refId: "lld-concurrency" },
        { text: "Study HLD Observability: RED metrics, distributed tracing, and log correlation", type: "system", refId: "sd-observability" },
        {
          text: "Code an asynchronous worker queue in Python with exponential backoff and dead-letter queues",
          type: "custom",
          checklist: [
            "**Shape.** A producer enqueues jobs; a pool of async workers pulls, processes, and acks. Bound concurrency with a semaphore to protect downstreams.",
            "**Retries.** Exponential backoff with jitter on transient failures, with a capped attempt count; make handlers idempotent so retries do not double-apply.",
            "**Dead-letter queue.** After max attempts, route the job to a DLQ with the error and context for later inspection instead of blocking the queue.",
            "**Backpressure.** Bound the queue and apply backpressure (or shed load) when full rather than exhausting memory.",
            "**Observability.** Metrics for queue depth, processing latency, and retry/DLQ counts; graceful shutdown that drains in-flight work."
          ]
        },
        {
          text: "Design a secure sandbox environment for execution of unverified agent tool code",
          type: "custom",
          checklist: [
            "**Threat model.** Treat agent-generated or tool code as hostile: assume it will try to read secrets, reach the network, or escape.",
            "**Isolation.** Run in a locked-down container or microVM (gVisor, Firecracker) or a subprocess with seccomp; no host mounts, dropped capabilities.",
            "**Resource limits.** CPU, memory, wall-clock, and output-size caps; kill on timeout so a runaway cannot pin resources.",
            "**Network egress.** Deny by default and allow-list only required endpoints; block cloud metadata endpoints and internal services.",
            "**No ambient credentials.** Inject only scoped, short-lived tokens; never expose host environment variables or secrets to sandboxed code."
          ]
        }
      ]
    },
    {
      title: "Week 11: Distributed Transactions, API Security & STAR Stories",
      desc: "Handle multi-service consistency, token auth, and behavioral loops.",
      items: [
        { text: "Study HLD Distributed Transactions: 2PC vs Saga orchestration and choreography", type: "system", refId: "sd-transactions" },
        { text: "Study HLD Auth and API Security (JWT, OAuth2, gateway validation)", type: "system", refId: "sd-auth" },
        { text: "Study prompt injection defense: untrusted input, isolation, and system-prompt safety", type: "topic", refId: "prompt-injection-security" },
        {
          text: "Draft 8 behavioral stories in the STAR format targeting SDE-2 criteria (Autonomy, Ambiguity, Mentoring)",
          type: "custom",
          checklist: [
            "**Coverage.** Draft 8 stories spanning SDE-2 signals: ownership/autonomy, ambiguity, conflict, failure and learning, mentoring, and delivery under pressure.",
            "**STAR structure.** Keep Situation and Task brief; spend most words on your specific Actions (I, not we); quantify the Result.",
            "**Reusability.** Pick stories rich enough to answer several prompts from different angles; map each to 2-3 likely questions.",
            "**Adobe lens.** Tie at least two to shipping AI or backend features, cross-team collaboration, and handling scope and ambiguity.",
            "**Rehearse.** Say each aloud to about two minutes; trim rambling and lead with the outcome."
          ]
        }
      ]
    },
    {
      title: "Week 12: Capstone Mock Interviews & MLOps/LLMOps Review",
      desc: "Final preparations, mock interviews, and containerized deployment basics.",
      items: [
        { text: "Solve 'Binary Tree Maximum Path Sum' problem", type: "problem", refId: "binary-tree-max-path-sum" },
        { text: "Solve 'Find Median from Data Stream' problem", type: "problem", refId: "median-from-data-stream" },
        { text: "Solve 'Word Search II' problem", type: "problem", refId: "word-search-ii" },
        { text: "Study containerization and Kubernetes: Docker, pods, and pod autoscaling", type: "topic", refId: "containerization-k8s" },
        { text: "Study cloud-native deployment on Azure/AWS/GCP: managed K8s and managed services", type: "topic", refId: "cloud-native-deployment" },
        { text: "Study model compression and quantization formats: GGUF, GPTQ, AWQ", type: "topic", refId: "model-compression-quant" },
        { text: "Study MLOps/LLMOps evaluation and monitoring: versioning, offline eval, A/B, drift", type: "topic", refId: "mlops-llmops-eval" },
        {
          text: "Perform a full 45-minute timed system design mock and a 45-minute coding round mock",
          type: "custom",
          checklist: [
            "**Coding mock.** 45 minutes on an unseen medium/hard: clarify, state approach and complexity before coding, then test aloud under a real timer.",
            "**System design mock.** 45 minutes on an AI-flavored prompt (for example a RAG service): requirements, estimates, API, high-level design, then a deep dive.",
            "**Record and review.** Note where you stalled, missed trade-offs, or went silent, and convert each gap into a targeted revision item.",
            "**Behavioral pass.** Run 2-3 STAR stories cold against a peer or rubric.",
            "**Iterate.** Do at least two rounds; the second should visibly fix the first round's weak spots."
          ]
        }
      ]
    }
  ]
};
